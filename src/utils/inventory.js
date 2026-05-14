export function updateInventorySpace(entity) {
    const inventory = entity.data.inventory;

    const totalItems = Object.values(
        inventory.items
    ).reduce((sum, amount) => sum + amount, 0);

    inventory.freeSpace = Math.max(
        0,
        inventory.carryCapacity - totalItems
    );
}