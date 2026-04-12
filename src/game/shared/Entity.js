//classes for entities

class Entity {
    constructor({ id, x, y, type, sprite, collider, data }) {
        this.id = id;
        this.x = x;
        this.y = y;

        this.type = type;

        this.sprite = sprite;
        this.collider = collider;
        this.data = data;
    }
}

export default Entity;