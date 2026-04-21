// funciones de cálculo genéricas (probabilidades, random, operaciones)
// generic calculation functions (probabilities, random, operations)

export function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}