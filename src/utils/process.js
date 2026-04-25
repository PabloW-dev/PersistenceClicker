//para la función que crea los procesos:
export default function createProcess({duration, onComplete, payload}) {
    return {
        id: crypto.randomUUID(),
        progress: 0,
        duration,
        onComplete,
        payload
    }
}