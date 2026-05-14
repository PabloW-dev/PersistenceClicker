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
                    structureId: null,
                    occupiedBy: null
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

        if (tile?.structureId) return true;

        const blockingStructure = worldState.structures.find(
            s => s.type === "tower" || s.type === "centerTown"
        );

        if (blockingStructure) {
            const worldX = x * this.cellSize + this.cellSize / 2;
            const worldY = y * this.cellSize + this.cellSize / 2;

            const dx = worldX - blockingStructure.x;
            const dy = worldY - blockingStructure.y;

            const dist = Math.sqrt(dx * dx + dy * dy);

            const radiusPx = blockingStructure.data?.navRadiusPx ?? 96;

            if (dist < radiusPx) {
                return true;
            }
        }

        return false;
    }
}

export default Grid;