// funciones de cálculo genéricas (probabilidades, random, operaciones)
// generic calculation functions (probabilities, random, operations)

export function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomSpawnPosition(center, minR, maxR) {
    const angle = Math.random() * Math.PI * 2;

    const radius = Math.random() * (maxR - minR) + minR;

    return {
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius
    };
}

export function isSpawnValid(x, y, tower, minDist, grid) {
    // 1. no spawnear dentro de la torre
    const dx = x - tower.x;
    const dy = y - tower.y;
    const distToTower = Math.sqrt(dx * dx + dy * dy);

    if (distToTower < minDist) return false;

    // 2. no spawnear dentro de celdas bloqueadas
    const cell = grid.worldToGrid({ x, y });

    if (!grid.isValidCell(cell.x, cell.y)) return false;

    if (grid.isBlocked(cell.x, cell.y)) return false;

    return true;
}