// Grid of the world
import worldState from "./WorldState";

const cellSize = 32;

class Grid {
    constructor(worldWidth, worldHeight) {
        this.cellSize = cellSize;

        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        this.width = Math.ceil(worldWidth / cellSize);
        this.height = Math.ceil(worldHeight / cellSize);

        this.cells = this.createGrid();
    }

    createGrid() {
        const grid = [];

        for (let x = 0; x < this.width; x++) {
            grid[x] = [];

            for (let y = 0; y < this.height; y++) {
                grid[x][y] = {
                    blocked: false,
                    structureId: null
                };
            }
        }

        return grid;
    }

    worldToGrid(pos) {
        return {
            x: Math.floor(pos.x / this.cellSize),
            y: Math.floor(pos.y / this.cellSize)
        };
    }

    gridToWorld(cell) {
        return {
            x: cell.x * this.cellSize + this.cellSize / 2,
            y: cell.y * this.cellSize + this.cellSize / 2
        };
    }

    isValidCell(x, y) {
        return (
            x >= 0 &&
            y >= 0 &&
            x < this.width &&
            y < this.height
        );
    }

    getCell(x, y) {
        if (!this.isValidCell(x, y)) return null;
        return this.cells[x][y];
    }

    isBlocked(x, y) {
        const cell = this.getCell(x, y);

        if (!cell) return true;

        if (cell.blocked) return true;

        const tile = worldState.tileMap?.getTile(x, y);

        if (tile?.structureId) return true; //este if hay que cambiarlo, tal y com oestá ahora los árboles van a devolver no walkables

        const tower = worldState.structures.find(s => s.type === "tower");
        if (tower) {
            const cellSize = this.cellSize;

            const worldX = x * cellSize + cellSize / 2;
            const worldY = y * cellSize + cellSize / 2;

            const dx = worldX - tower.x;
            const dy = worldY - tower.y;

            const dist = Math.sqrt(dx * dx + dy * dy);

            const radiusPx = tower.data?.navRadiusPx ?? 96;

            if (dist < radiusPx) {
                return true;
            }
        }

        return false;
    }
}

export default Grid;