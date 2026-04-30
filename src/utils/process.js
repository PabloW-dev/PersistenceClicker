//para la función que crea los procesos:
export default function createProcess({type, duration, onComplete, payload}) {
    return {
        id: crypto.randomUUID(),
        type,
        state: "active",
        progress: 0,
        duration,
        onComplete,
        payload,
        cancelled: false
    }
}