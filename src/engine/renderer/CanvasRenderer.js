// encargado de dibujar elementos en el canvas y manejar requestAnimationFrame
// for drawing elements on the canvas and handling requestAnimationFrame
import AssetsManager from "../../assets/AssetsManager";

class CanvasRenderer { //la clase que se va a meter en GameManager para asociarla al canvas de react sin mezclar trabajo de React con trabajo de la lógica

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.setupEvents();
    }

    setupEvents() {
        //adding listener for the mouse
        this.canvas.addEventListener("click", (e) => {
            const rect = this.canvas.getBoundingClientRect();

            //User mouse position inside canvas
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            //update mouse position inside canvas
            this.onClick && this.onClick({ x, y });
        });
    }

    render(worldState, camera) {
        const ctx = this.ctx;

        //clean screen for redrawing, since 0,0 until canvas width and height
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //drawing structures
        worldState.structures.forEach(structure => {
            const screenPos = camera.worldToScreen({ //take the coordinates of the world and draw it in the screen
                x: structure.x,
                y: structure.y
            });

            if(structure.sprite.type === "tower") {
                const img = AssetsManager.getImage(structure.sprite.type);

                if(!img || !img.complete) return;

                const width = 128;
                const height = 128;

                const anchor = structure.sprite.anchor || { x: 0.5, y: 0.75 };

                ctx.drawImage(
                    img,
                    screenPos.x - width * anchor.x,
                    screenPos.y - height * anchor.y,
                    width,
                    height
                );
            }
        });

        // drawing entities
        worldState.entities.forEach(entity => {
            const screenPos = camera.worldToScreen({
                x: entity.x,
                y: entity.y
            });

            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(screenPos.x, screenPos.y, 10, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

export default CanvasRenderer;