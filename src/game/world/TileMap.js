import Tile from "./Tile";

let groundTypeOptions = [
    "plain",
    "water",
    "fertile",
    "rocks"
];

let factionTypeOptions = [
    "discipline",
    "ritual",
    "survival",
    "develop"
];

class TileMap {
    constructor(width, height, seed, cellSize) {
        this.width = width;
        this.height = height;
        this.seed = seed;
        this.cellSize = cellSize;

        this.tiles = this.generate();
    }

    random(x, y, offset = 0) {
        const val = Math.sin(
            x * 12.9898 +
            y * 78.233 +
            this.seed * 0.0001 +
            offset
        ) * 43758.5453;

        return val - Math.floor(val);
    }

    generate() {
        const tiles = [];
        const values = [];

        // 1. GENERAR MAPA DE VALORES (ruido continuo)
        for (let x = 0; x < this.width; x++) {
            tiles[x] = [];
            values[x] = [];

            for (let y = 0; y < this.height; y++) {
                const macro = this.smoothNoise(x, y, 20, 10);
                const micro = this.smoothNoise(x, y, 6, 20);

                const value = macro * 0.75 + micro * 0.25;

                values[x][y] = value;
            }
        }

        // 2. CALCULAR THRESHOLDS SEGÚN PROPORCIONES
        const thresholds = this.computeThresholds(values);

        // 3. GENERAR TILES FINALES
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                tiles[x][y] = this.createTile(x, y, values[x][y], thresholds);
            }
        }

        return tiles;
    }

    computeThresholds(values) {
        const flat = [];

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                flat.push(values[x][y]);
            }
        }

        flat.sort((a, b) => a - b);

        const get = (p) => flat[Math.floor(p * flat.length)];

        return {
            water: get(0.2),    // 20%
            plain: get(0.65),    // +40%
            fertile: get(0.9)   // +30%
            // resto = rocks (10%)
        };
    }

    createTile(x, y, value, thresholds) {
        const worldX = x * this.cellSize + this.cellSize / 2;
        const worldY = y * this.cellSize + this.cellSize / 2;

        const dx = worldX - 1000;
        const dy = worldY - 800;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const radiusPx = 210;

        if (dist < radiusPx) {
            return new Tile({
                groundType: "center",
                factionType: "center"
            });
        }

        let type;

        if (value < thresholds.water) type = "water";
        else if (value < thresholds.plain) type = "plain";
        else if (value < thresholds.fertile) type = "fertile";
        else type = "rocks";

        // pequeños detalles (mantienes tu caos)
        const chaos = this.random(x, y, 30);
        if (chaos < 0.03) {
            const r = this.random(x, y, 40);
            type = groundTypeOptions[
                Math.floor(r * groundTypeOptions.length)
            ];
        }

        return new Tile({
            groundType: type,
            factionType: this.getFactionType(x, y)
        });
    }

    getTile(x, y) {
        return this.tiles[x]?.[y] ?? null;
    }

    getFactionType(x, y) {
        const r = this.random(x * 0.2, y * 0.2, 100);

        let type = factionTypeOptions[
            Math.floor(r * factionTypeOptions.length)
        ];

        const chaos = this.random(x, y, 200);

        if (chaos < 0.2) {
            const r2 = this.random(x, y, 300);
            type = factionTypeOptions[
                Math.floor(r2 * factionTypeOptions.length)
            ];
        }

        return type;
    }

    smoothNoise(x, y, scale, offset) {
        const gx = Math.floor(x / scale);
        const gy = Math.floor(y / scale);

        const tx = (x % scale) / scale;
        const ty = (y % scale) / scale;

        const r00 = this.random(gx,     gy,     offset);
        const r10 = this.random(gx + 1, gy,     offset);
        const r01 = this.random(gx,     gy + 1, offset);
        const r11 = this.random(gx + 1, gy + 1, offset);

        const ix0 = this.lerp(r00, r10, tx);
        const ix1 = this.lerp(r01, r11, tx);

        return this.lerp(ix0, ix1, ty);
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }
}

export default TileMap;