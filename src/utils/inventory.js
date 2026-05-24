export function updateInventorySpace(entity) {
    if(entity.data.inventory) {
        const inventory = entity.data.inventory;

        const totalItems = Object.values(
            inventory.items
        ).reduce((sum, amount) => sum + amount, 0);

        inventory.freeSpace = Math.max(
            0,
            inventory.carryCapacity - totalItems
        );
    } else if(entity.data.storage) {
        const storage = entity.data.storage;

        const totalItems = Object.values(
            storage.items
        ).reduce((sum, amount) => sum + amount, 0);

        storage.freeSpace = Math.max(
            0,
            storage.capacity - totalItems
        );
    }
}