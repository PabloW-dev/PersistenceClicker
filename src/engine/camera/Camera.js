//camera for the game

class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    screenToWorld(pos) {
        return {
            x: pos.x + this.x,
            y: pos.y + this.y
        };
    }

    worldToScreen(pos) {
        return {
            x: pos.x - this.x,
            y: pos.y - this.y
        };
    }
}

export default Camera;