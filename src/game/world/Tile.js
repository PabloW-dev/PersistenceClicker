//Class for the tiles of the game:

class Tile {
    constructor({ groundType, factionType, groundData = {} }) {
        this.groundType = groundType;
        this.factionType = factionType;

        this.groundData = groundData;

        this.structureId = null;
    }
}

export const GroundMoveCost = {
    plain: 1,
    fertile: 1.2,
    rocks: 1.8,
    water: 0.5,
    center: 1,
    centerRing: 1
};

export default Tile;

