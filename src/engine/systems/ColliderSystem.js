// definición de colliders para interacciones y click sobre sprittes
// definition of colliders for interactions and clicks on sprittes

export function getEntityAtPosition(pos, entities) {
    return entities.find(entity => {

        //found the collider of the entity we give to the function
        const collider = entity.collider;
        if (!collider) return false;

        ////extracting the offset and default offset is not defined
        const offset = collider.offset || { x: 0, y: 0 };

        //collider world position
        const colliderX = entity.x + offset.x;
        const colliderY = entity.y + offset.y;

        //distance to collider center
        const dx = pos.x - colliderX;
        const dy = pos.y - colliderY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < collider.radius;
    });
}