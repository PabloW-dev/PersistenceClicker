const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },

    { x: 1, y: 1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 }
]; //eight directions

export function findPath(start, target, grid) {
    const queue = [];
    const visited = new Set();
    const cameFrom = new Map();

    const key = (c) => `${c.x},${c.y}`;

    queue.push(start);
    visited.add(key(start));

    while (queue.length > 0) {
        const current = queue.shift();

        //llegado al destino
        if (current.x === target.x && current.y === target.y) {
            return reconstructPath(cameFrom, current);
        }

        for (const dir of directions) {
            const next = {
                x: current.x + dir.x,
                y: current.y + dir.y
            };

            const k = key(next);

            if (visited.has(k)) continue;
            if (!grid.isValidCell(next.x, next.y)) continue;
            if (grid.isBlocked(next.x, next.y)) continue;

            visited.add(k);
            queue.push(next);

            cameFrom.set(k, current);
        }
    }

    //no hay camino
    return [];
}

function reconstructPath(cameFrom, current) {
    const path = [];
    const key = (c) => `${c.x},${c.y}`;

    while (cameFrom.has(key(current))) {
        path.push(current);
        current = cameFrom.get(key(current));
    }

    path.reverse();
    return path;
}