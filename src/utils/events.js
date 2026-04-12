// gestión de eventos del juego (EvenEmitter o custom events)
// game event management (EvenEmitter or custom events)


const listeners = {};

export function on(event, fn) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);

    return () => {
        listeners[event] = listeners[event].filter(l => l !== fn);
    };
}

export function emit(event, data) {
    if (!listeners[event]) return;
    listeners[event].forEach(fn => fn(data));
}