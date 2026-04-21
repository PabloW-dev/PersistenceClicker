//for manage the sprittes

class AssetManager {
    constructor() {
        this.images = {};
    }

    loadAll(manifest) {
        for (const key in manifest) {
            const img = new Image();
            img.src = manifest[key];
            this.images[key] = img;
        }
    }

    getImage(key) {
        return this.images[key];
    }
}

export default new AssetManager();