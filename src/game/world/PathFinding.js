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
    const targetKey = key(target);

    queue.push(start);
    visited.add(key(start));

    while (queue.length > 0) {
        const current = queue.shift();

        //llegado al destino
        if (key(current) === targetKey) {
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
            if (grid.isBlocked(next.x, next.y) && k !== targetKey) continue;
            

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

export function getNearestWalkableCell(target, grid) {
    const center = grid.worldToGrid(target);

    const radius = 3;
    const candidates = [];

    for (let r = 0; r <= radius; r++) {
        for (let dx = -r; dx <= r; dx++) {
            for (let dy = -r; dy <= r; dy++) {
                const x = center.x + dx;
                const y = center.y + dy;

                if (!grid.isValidCell(x, y)) continue;
                if (!grid.isBlocked(x, y)) continue;
                
                candidates.push({ x, y });
            }
        }
    }

    if (candidates.length === 0) {
        return center;
    }

    return candidates[Math.floor(Math.random() * candidates.length)];
}