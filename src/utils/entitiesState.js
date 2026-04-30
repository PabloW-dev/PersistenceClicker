    export function canBeSelected(entity) {
        return entity.data.state !== "leveling" && entity.data.state !== "dead";
    }

    export function canReceiveOrders(entity) {
        return entity.data.state !== "leveling" && entity.data.state !== "dead";
    }

    export function canMove(entity) {
        return entity.data.state === "moving" || "moving_to_tower";
    }

    export function canAct(entity) {
        return !["moving", "leveling", "dead"].includes(entity.data.state);
    }

    export function canAttack(entity, target, dist) {
    if (!target) return false;
    if (entity.data.attackTimer > 0) return false;
    if (target.data.hp <= 0) return false;

    return dist <= entity.data.attackRange;
}