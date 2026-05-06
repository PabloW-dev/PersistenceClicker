// seed con las condiciones de cómo se debe generar el mapa de B:

export default function generateSeed() {
    return Math.floor(Math.random() * 1000000); // por qué tantos ceros? está relacionado con el tamaño del mapa o resulta mera estética?
    
    
    // a meter: 
    // que los tiles de townCenter resulten siempre del mismo type en ambos valores,
    // que se generen 10 casas en posiciones aleatorias,
    // que se generen los tiles de forma random: no que parezca un cuadro de arte contemporáneo pero sí haya tiles de disciplineType incómodos:
    // quiero decir, que estén repartidos de forma no óptima, no cómoda, que algunos estén en medio entre otros types para tocar las narices al colocar un edificio a cosntruir
    // que se generen la plantas (que resultan entities) para recoger madera
    // ya meteremos más cosas que se tienen que generar conforme avance el proyecto
}
