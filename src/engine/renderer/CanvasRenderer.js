// encargado de dibujar elementos en el canvas y manejar requestAnimationFrame
// for drawing elements on the canvas and handling requestAnimationFrame
import AssetsManager from "../../assets/AssetsManager";
import gameStateA from "../../game/faceA/state/GameStateA.js";

class CanvasRenderer { //la clase que se va a meter en GameManager para asociarla al canvas de react sin mezclar trabajo de React con trabajo de la lógica

    constructor(canvas) {
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
        const ctx = this.ctx;

        //clean screen for redrawing, since 0,0 until canvas width and height
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //drawing structures
        worldState.structures.forEach(structure => {
            const screenPos = camera.worldToScreen({ //take the coordinates of the world and draw it in the screen
                x: structure.x,
                y: structure.y
            });

            if (structure.sprite) {
                const img = AssetsManager.getImage(structure.sprite.type);

                if (!img || !img.complete) return;

                const width = 128;
                const height = 128;

                const anchor = structure.sprite.anchor || { x: 0.5, y: 0.75 };

                ctx.drawImage(
                    img,
                    screenPos.x - width * anchor.x,
                    screenPos.y - height * anchor.y,
                    width,
                    height
                );
            }
        });

        // drawing entities
        worldState.entities.forEach(entity => {
            const screenPos = camera.worldToScreen({
                x: entity.x,
                y: entity.y
            });

            
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
                    if (entity.data?.hitFlash > 0) {
                        alpha *= 0.5;
                    }

                    ctx.save();

                    ctx.globalAlpha = alpha;

                    ctx.translate(screenPos.x, screenPos.y);
                    ctx.scale(scale, scale);

                    ctx.drawImage(
                        img,
                        -width * anchor.x,
                        -height * anchor.y,
                        width,
                        height
                    );

                    ctx.restore();
                }

            } else {
                // fallback (debug)
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.arc(screenPos.x, screenPos.y, 10, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        if (gameStateA.hint.active) {
            const screenPos = camera.worldToScreen({
                x: gameStateA.hint.x,
                y: gameStateA.hint.y
            });

            ctx.save();

            // pulso suave
            const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.1;

            ctx.translate(screenPos.x, screenPos.y);
            ctx.scale(pulse, pulse);

            // glow simple
            ctx.fillStyle = "rgba(255, 220, 0, 0.9)";
            ctx.beginPath();
            ctx.arc(0, -40, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        this.renderSelection(ctx, worldState, camera, selectedEntityId);
    }

    renderSelection(ctx, worldState, camera, selectedEntityId) {
        if (!selectedEntityId) return;

        const selected = worldState.entities.find(
            e => e.id === selectedEntityId
        );


        if (!selected) return;

        const screenPos = camera.worldToScreen({
            x: selected.x,
            y: selected.y
        });


        const width = selected.sprite?.size?.w || 32;
        const height = selected.sprite?.size?.h || 32;

        const anchor = selected.sprite?.anchor || { x: 0.5, y: 0.5 };

        ctx.save();

        ctx.strokeStyle = "rgba(0, 255, 120, 0.9)";
        ctx.lineWidth = 3;
        ctx.shadowColor = "rgba(0, 255, 120, 0.6)";
        ctx.shadowBlur = 10;

        const padding = Math.max(2, width * 0.05);

        ctx.strokeRect(
            screenPos.x - width * anchor.x - padding,
            screenPos.y - height * anchor.y - padding,
            width + padding * 2,
            height + padding * 2
        );

        ctx.restore();
    }
}

export default CanvasRenderer;