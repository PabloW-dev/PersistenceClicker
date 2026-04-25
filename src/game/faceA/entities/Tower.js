// torre central
// central tower
import Entity from "../../shared/Entity.js";

function createTower() {
    return new Entity({
        id: "tower",
        x: 400,
        y: 300, //position in the world, not fixed for the world size yet

        type: "tower",

        sprite: {
            type: "tower",
            anchor: {
                x: 0.5,
                y: 0.75
            }
        },

        collider: {
            radius: 40,
            offset: {
                x: 0,
                y: -50
            }
        },

        data: {
            hp: 1000,
            navSize: 1,
            navOffsetY: -1
        }
    });
}

export default createTower;