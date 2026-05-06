//camera of the game

class Camera {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = 1000,
        this.y = 800,

        this.isDragging = false;
        this.dragStart = null;

        this.cameraStart = null;
        this.hasDragged = false;

        this.DRAG_THRESHOLD = 28;

        this.zoom = 1.8;

        this.initInput(canvas);
    }

    initInput(canvas) {
        canvas.addEventListener("mousedown", (e) => {
            const rect = canvas.getBoundingClientRect();

            this.isDragging = false;
            this.hasDragged = false;
            this.dragStart = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            this.cameraStart = { x: this.x, y: this.y };
        });

        canvas.addEventListener("mousemove", (e) => {
            if (!this.dragStart) return;

            const rect = canvas.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const dx = x - this.dragStart.x;
            const dy = y - this.dragStart.y;

            if (Math.abs(dx) > this.DRAG_THRESHOLD || Math.abs(dy) > this.DRAG_THRESHOLD) {
                this.isDragging = true;
                this.hasDragged = true;

                this.x = this.cameraStart.x - dx / this.zoom;
                this.y = this.cameraStart.y - dy / this.zoom;
            }
        });

        canvas.addEventListener("mouseup", () => {
            this.dragStart = null;
            this.isDragging = false;
        });

        canvas.addEventListener("mouseleave", () => {
            this.dragStart = null;
            this.isDragging = false;
        });
    }

    endInteraction() {
        // reset del flag de click/drag
        this.hasDragged = false;
    }

    clamp(worldWidth, worldHeight, canvasWidth, canvasHeight) {
        const halfW = canvasWidth / (2 * this.zoom);
        const halfH = canvasHeight / (2 * this.zoom);

        this.x = Math.max(halfW, Math.min(this.x, worldWidth - halfW));
        this.y = Math.max(halfH, Math.min(this.y, worldHeight - halfH));
    }

    screenToWorld(pos) {
        return {
            x: (pos.x - this.canvas.width / 2) / this.zoom + this.x,
            y: (pos.y - this.canvas.height / 2) / this.zoom + this.y
        };
    }

    worldToScreen(pos) {
        return {
            x: (pos.x - this.x) * this.zoom + this.canvas.width / 2,
            y: (pos.y - this.y) * this.zoom + this.canvas.height / 2
        };
    }
}

export default Camera;