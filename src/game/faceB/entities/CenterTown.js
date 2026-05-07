import Entity from "../../shared/Entity.js";


function createCenterTown() {
    return new Entity({
        id: "centerTown",
        x: 1000,
        y: 800, //position in the world

        type: "centerTown",

        sprite: {
            type: "centerTown",
            anchor: {
                x: 0.5,
                y: 0.5
            },
            size: {
                w: 270,
                h: 270
            }
        },

        collider: {
            radius: 70, //TO DO : ADJUST!
            offset: {
                x: 0,
                y: 0
            }
        },

        data: {
            navSize: 3,
            navOffsetY: 0,

            navRadiusPx: 70
        }
    });
}

export default createCenterTown;