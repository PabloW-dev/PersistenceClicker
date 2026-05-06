//Class for the tiles of the game:

class Tile {
    constructor({ groundType, factionType }) {
        this.groundType = groundType;
        this.factionType = factionType;

        this.structureId = null;
    }
}

export default Tile;