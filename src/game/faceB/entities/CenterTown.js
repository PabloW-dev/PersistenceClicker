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
                w: 360,
                h: 360
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
            navSize: 1,
            navOffsetY: -1,
        }
    });
}

export default createCenterTown;