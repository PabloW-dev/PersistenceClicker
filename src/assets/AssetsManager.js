//for manage the sprittes

class AssetManager {
    constructor() {
        this.images = {};
    }

    loadImage(key, src) {
        const img = new Image();
        img.src = src;
        this.images[key] = img;
    }

    getImage(key) {
        return this.images[key];
    }
}

export default new AssetManager();