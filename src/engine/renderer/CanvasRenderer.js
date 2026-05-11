// encargado de dibujar elementos en el canvas y manejar requestAnimationFrame
// for drawing elements on the canvas and handling requestAnimationFrame
import AssetsManager from "../../assets/AssetsManager";
import assetManifest from "../../assets/AssetsManifest.js";
import gameStateA from "../../game/faceA/state/GameStateA.js";
import gameState from "../../game/state/GameStateG.js";

class CanvasRenderer { //la clase que se va a meter en GameManager para asociarla al canvas de react sin mezclar trabajo de React con trabajo de la lógica

    constructor(canvas) {
        if (!canvas) {
            console.warn("CanvasRenderer initialized without canvas");
            return;
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.setupEvents();
    }

    setupEvents() {
        //adding listener for the mouse
        this.canvas.addEventListener("click", (e) => {
            const rect = this.canvas.getBoundingClientRect();

            //User mouse position inside canvas
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            //update mouse position inside canvas
            this.onClick && this.onClick({ x, y });
        });
    }

    render(worldState, camera, selectedEntityId) {
        if (!this.ctx) return;

        const ctx = this.ctx;

        //clean screen for redrawing, since 0,0 until canvas width and height
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.save();

        // cámara + zoom
        ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        ctx.scale(camera.zoom, camera.zoom);
        ctx.translate(-camera.x, -camera.y);

        //drawing background
        if(assetManifest.backgroundA) {
            const backgroundImg = AssetsManager.getImage("backgroundA");

            if(backgroundImg) {
                const BGwidth = 2000;
                const BGheight = 1600;

                ctx.drawImage(
                    backgroundImg,
                    0,
                    0,
                    BGwidth,
                    BGheight
                );
            };

        }

        if (gameState.currentFace === "B") {
            ctx.save();

            ctx.globalAlpha = 0.6;
            ctx.fillStyle = "#50D882";

            ctx.fillRect(
                0,
                0,
                2000,
                1600
            );

            ctx.restore();
        }
        // TODO: Fondo compartido entre Face A y Face B
        // - Usar una única textura base del mapa (2000x1600)
        // - Aplicar un overlay de color según la cara activa
        //   Face A → sin overlay o tono neutro
        //   Face B → overlay de color (ej: morado/azulado) con alpha
        // - Esto evita duplicar assets y mantiene coherencia visual

        const tileMap = worldState.tileMap;
        const grid = worldState.grid;

        if(tileMap) {
            for (let x = 0; x < tileMap.width; x++) {
                for (let y = 0; y < tileMap.height; y++) {
                    const tile = tileMap.getTile(x, y);
                    if (!tile) continue;

                    const worldPos = grid.gridToWorld({ x, y });

                    this.drawTile(ctx, tile, worldPos, grid.cellSize);
                }
            }
        }

        //drawing scenograpghics
        const scenographicsSorted = [...worldState.scenographics].sort((a, b) => a.y - b.y);
        
        scenographicsSorted.forEach(scenographique => {
            if (scenographique.sprite) {
                const img = AssetsManager.getImage(scenographique.sprite.type);

                if (!img || !img.complete) return;

                const width = scenographique.sprite.size?.w || 32;
                const height = scenographique.sprite.size?.h || 48;

                const anchor = scenographique.sprite.anchor || { x: 0.5, y: 0.75};

                const scale = scenographique.data.scale ?? 1;

                ctx.save();

                ctx.translate(scenographique.x, scenographique.y);
                ctx.scale(scale, scale);

                ctx.drawImage(
                    img,
                    - width * anchor.x,
                    - height * anchor.y,
                    width,
                    height
                );

                ctx.restore();

                const worker = worldState.entities.find(e =>
                    e.type === "villager" &&
                    e.data.actionTarget?.id === scenographique.id &&
                    e.data.state === "obtaining_resources" &&
                    e.data.path.length <= 0
                );

                const boostable = worker && !gameState.selectedEntityId;

                if(boostable) {
                    const pulse = 0.7 + Math.sin(Date.now() * 0.01) * 0.3;

                    ctx.save();

                    ctx.translate(scenographique.x, scenographique.y);

                    ctx.globalAlpha = pulse;

                    ctx.strokeStyle = "rgba(255,255,120,0.9)";
                    ctx.lineWidth = 3;

                    ctx.beginPath();
                    ctx.arc(0, 0, 24, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.restore();

                }
            }
        });

        //drawing structures
        worldState.structures.forEach(structure => {
            if (structure.sprite) {
                const img = AssetsManager.getImage(structure.sprite.type);

                if (!img || !img.complete) return;

                const width = structure.sprite.size?.w || 128;
                const height = structure.sprite.size?.h || 128;

                const anchor = structure.sprite.anchor || { x: 0.5, y: 0.75 };

                ctx.drawImage(
                    img,
                    structure.x - width * anchor.x,
                    structure.y - height * anchor.y,
                    width,
                    height
                );
            }
        });

        // drawing entities
        worldState.entities.forEach(entity => {

            if (entity.data?.hiddenInStructure) {
                return;
            }

            if (entity.sprite) {
                const img = AssetsManager.getImage(entity.sprite.type);

                if (img && img.complete) {
                    const anchor = entity.sprite.anchor || { x: 0.5, y: 0.5 };
                    const width = entity.sprite.size?.w || 32;
                    const height = entity.sprite.size?.h || 32;

                    // spawn animation
                    let scale = 1;
                    let alpha = 1;

                    if (entity.data?.spawning) {
                        const t = entity.data.spawnProgress;
                        scale = 0.5 + t * 0.5;;
                        alpha = t;
                    }

                    // hit flash
                    if (entity.data?.clickHitFlash > 0) {
                        alpha *= 0.5;
                    }

                    // combat hit flash (ARCHETYPES + ENEMIES + PORTALS)
                    if (entity.data?.hitFlash > 0) {
                        alpha *= 0.6 + Math.sin(Date.now() * 0.05) * 0.2;
                    }

                    if (entity.data?.attackFlash > 0) {
                        alpha *= 1.15; // pequeño “pop”
                        scale *= 1.25; // micro punch visual
                    }

                    ctx.save();

                    ctx.globalAlpha = alpha;

                    ctx.translate(entity.x, entity.y);

                    // villager warning flash
                    if (
                        entity.type === "villager" &&
                        entity.data?.warningFlash > 0
                    ) {
                        const shake =
                            Math.sin(Date.now() * 0.05) *
                            entity.data.warningFlash *
                            6;

                        ctx.translate(shake, 0);

                        switch (entity.data.warningType) {
                            case "energy":
                                ctx.globalAlpha *= 0.7 + Math.sin(Date.now() * 0.08) * 0.3;
                                break;

                            case "food":
                                ctx.globalAlpha *= 0.8;
                                break;

                            case "water":
                                scale *= 0.9 + Math.sin(Date.now() * 0.04) * 0.08;
                                break;

                            case "inventory":
                                scale *= 0.85;
                                break;

                            case "profession":
                                ctx.globalAlpha *= 0.5;
                                break;

                            case "resource":
                                scale *= 0.95;
                                ctx.globalAlpha *= 0.6;
                            break;
                        }
                    }

                    if (entity.data?.state === "dead") {
                        ctx.rotate(Math.PI / 2); // 90º
                        ctx.globalAlpha *= 0.6;
                    }

                    // ACTION FLASH
                    if (entity.data?.actionFlash > 0) {
                        const shakeX =
                            (Math.random() - 0.5) *
                            entity.data.actionFlash *
                            6;

                        const shakeY =
                            (Math.random() - 0.5) *
                            entity.data.actionFlash *
                            4;

                        ctx.translate(shakeX, shakeY);

                        scale *= 1.03;
                    }

                    ctx.scale(scale, scale);

                    ctx.drawImage(
                        img,
                        -width * anchor.x,
                        -height * anchor.y,
                        width,
                        height
                    );

                    if (entity.data?.state === "investigating") {
                        const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.1;

                        ctx.save();

                        ctx.scale(pulse, pulse);

                        // glow circular
                        const radius = Math.max(width, height) * 0.7;

                        ctx.globalCompositeOperation = "lighter";
                        ctx.shadowColor = "rgba(100, 200, 255, 0.8)";
                        ctx.shadowBlur = 25;

                        ctx.beginPath();
                        ctx.arc(0, 0, radius, 0, Math.PI * 2);
                        ctx.fillStyle = "rgba(100, 200, 255, 0.35)";
                        ctx.fill();

                        ctx.restore();
                    }

                    ctx.restore();
                }

            } else {
                // fallback (debug)
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.arc(entity.x, entity.y, 10, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        if (gameStateA.hint.active) {
            ctx.save();

            // pulso suave
            const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.1;

            ctx.translate(gameStateA.hint.x, gameStateA.hint.y);
            ctx.scale(pulse, pulse);

            // glow simple
            ctx.fillStyle = "rgba(255, 220, 0, 0.9)";
            ctx.beginPath();
            ctx.arc(0, -40, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        this.renderSelection(ctx, worldState, camera, selectedEntityId);

        ctx.restore();
    }

    renderSelection(ctx, worldState, camera, selectedEntityId) {
        if (!selectedEntityId) return;

        const selected = worldState.entities.find(
            e => e.id === selectedEntityId
        );


        if (!selected) return;
        if (selected.data?.hiddenInStructure) return;

        const x = selected.x;
        const y = selected.y;


        const width = selected.sprite?.size?.w || 32;
        const height = selected.sprite?.size?.h || 32;

        const anchor = selected.sprite?.anchor || { x: 0.5, y: 0.5 };

        const lineWidth = 3 / camera.zoom;

        ctx.save();

        ctx.strokeStyle = "rgba(0, 255, 120, 0.9)";
        ctx.lineWidth = lineWidth;
        ctx.shadowColor = "rgba(0, 255, 120, 0.6)";
        ctx.shadowBlur = 10;

        const padding = Math.max(2, width * 0.05);

        ctx.strokeRect(
            x - width * anchor.x - padding + lineWidth / 2,
            y - height * anchor.y - padding + lineWidth / 2,
            width + padding * 2 - lineWidth,
            height + padding * 2 - lineWidth
        );

        ctx.restore();
    }

    drawTile(ctx, tile, pos, size) {
        let baseColor = this.getGroundColor(tile.groundType);

        const variant = tile.groundData?.variant;
        
        if (tile.groundType === "water" && variant) {
            const variant = tile.groundData.variant;

            if (variant === "small") {
                baseColor = [30, 90, 160]; // más oscuro
            } else if (variant === "medium") {
                baseColor = [50, 120, 200]; // base
            } else if (variant === "large") {
                baseColor = [80, 160, 230]; // más claro
            } else {
                baseColor = [40, 100, 180]; // agua fea, poco profunda
            }
        }
        
        const finalColor = this.applyFactionTint(baseColor, tile.factionType);

        ctx.fillStyle = finalColor;

        ctx.fillRect(
            pos.x - size / 2,
            pos.y - size / 2,
            size,
            size
        );

        if (
            tile.groundType === "water" &&
            tile.groundData?.variant !== "normal"
        ) {
            const img = AssetsManager.getImage("waterOverlay");

            if (img && img.complete) {
                ctx.save();

                if (variant === "small") ctx.globalAlpha = 0.5;
                else if (variant === "medium") ctx.globalAlpha = 0.7;
                else ctx.globalAlpha = 0.9;

                ctx.drawImage(
                    img,
                    pos.x - size / 2,
                    pos.y - size / 2,
                    size,
                    size
                );

                ctx.restore();
            }
        }
    }

    getGroundColor(type) {
        switch (type) {
            case "plain": return [120, 120, 120];
            case "water": return [50, 120, 200];
            case "fertile": return [80, 170, 90];
            case "rocks": return [5, 5, 5];
            case "center": return [240, 240, 240];
            case "centerRing": return [210, 210, 210];
            default: return [255, 0, 255]; // debug
        }
    }

    applyFactionTint(color, faction) {
        let [r, g, b] = color;

        switch (faction) {
            case "discipline":
                r += 30; // rojizo
                break;

            case "ritual":
                b += 30; // azulado/púrpura
                break;

            case "survival":
                r += 20;
                g += 20; // amarillento
                break;

            case "develop":
                g += 30; // más verde
                break;

            case "center":
                return "rgb(255,255,255)";

            case "centerRing":
                return "rgb(210,210,210)";
        }

        // clamp
        r = Math.min(255, r);
        g = Math.min(255, g);
        b = Math.min(255, b);

        return `rgb(${r}, ${g}, ${b})`;
    }
}

export default CanvasRenderer;