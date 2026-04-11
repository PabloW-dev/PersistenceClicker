// encargado de dibujar elementos en el canvas y manejar requestAnimationFrame
// for drawing elements on the canvas and handling requestAnimationFrame

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
}

export default CanvasRenderer;