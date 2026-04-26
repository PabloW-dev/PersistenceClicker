export function canBeSelected(entity) {
    return entity.data.state !== "leveling";
}

export function canReceiveOrders(entity) {
    return entity.data.state !== "leveling";
}

export function canMove(entity) {
    return entity.data.state === "moving";
}

export function canAct(entity) {
    return !["moving", "leveling"].includes(entity.data.state);
}