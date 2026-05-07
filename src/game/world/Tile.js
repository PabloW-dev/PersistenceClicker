//Class for the tiles of the game:

class Tile {
    constructor({ groundType, factionType, groundData = {} }) {
        this.groundType = groundType;
        this.factionType = factionType;

        this.groundData = groundData;

        this.structureId = null;
    }
}

export default Tile;