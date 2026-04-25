export function canBeSelected(entity) {
    return entity.data.state !== "leveling";
}

export function canReceiveOrders(entity) {
    return entity.data.state !== "leveling";
}

export function canMove(entity) {
    return entity.data.state === "moving";
}

export function canTakeDamage(entity) {
    return true; // incluso en leveling
}