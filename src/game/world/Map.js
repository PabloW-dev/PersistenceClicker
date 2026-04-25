import worldState from "./WorldState.js";

function clearGrid() {
    const grid = worldState.grid;

    for (let x = 0; x < grid.width; x++) {
        for (let y = 0; y < grid.height; y++) {
            grid.cells[x][y].blocked = false;
            grid.cells[x][y].structureId = null;
        }
    }
}

function syncStructuresToGrid() {
    const grid = worldState.grid;

    for (const s of worldState.structures) {
        const base = grid.worldToGrid({
            x: s.x,
            y: s.y + (s.data?.navOffsetY || 0) * grid.cellSize
        });

        const size = s.data?.navSize || 1;

        for (let dx = 0; dx < size; dx++) {
            for (let dy = 0; dy < size; dy++) {
                const x = base.x + dx;
                const y = base.y + dy;

                const cell = grid.getCell(x, y);
                if (!cell) continue;

                cell.blocked = true;
                cell.structureId = s.id;
            }
        }
    }
}

function syncWorldToGrid() {
    clearGrid();
    syncStructuresToGrid();
}

// throttle simple
let accumulator = 0;
const GRID_UPDATE_INTERVAL = 0.2;

export function updateGrid(deltaTime) {
    accumulator += deltaTime;

    if (accumulator < GRID_UPDATE_INTERVAL) return;

    accumulator = 0;
    syncWorldToGrid();
}