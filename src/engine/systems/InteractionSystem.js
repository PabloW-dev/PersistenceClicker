// detector de clicks
import { plusTime } from "../../utils/events";

function handleClick(pos) {
    // luego:
    // añadir que recibe un pos
    // - hit detection (collider system)
    // - detectar si es torre, enemigo, UI, etc
    console.log(pos);
    plusTime(); // de momento
}

export default handleClick;