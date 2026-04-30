export function canBeSelected(entity) {
    return entity.data.state !== "leveling" && entity.data.state !== "dead" && entity.data.state !== "investigating";
}

export function canReceiveOrders(entity) {
    return entity.data.state !== "leveling" && entity.data.state !== "dead" && entity.data.state !== "investigating";
}

export function canMove(entity) {
    return entity.data.state === "moving" || "moving_to_tower";
}

export function canAct(entity) {
    return !isBusyState(entity.data.state);
}

export function canAttack(entity, target, dist) {
    if (!target) return false;
    if (entity.data.attackTimer > 0) return false;
    if (target.data.hp <= 0) return false;

    return dist <= entity.data.attackRange;
}

function isBusyState(state) {
    return ["moving", "leveling", "investigating", "dead"].includes(state);
}
