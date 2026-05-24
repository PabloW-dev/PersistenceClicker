//actions of structures

export const STRUCTURE_ACTIONS = {
    rest(villager, structure) {
        villager.data.actionType = "resting";
        villager.data.actionTarget = structure;
        villager.data.state = "moving";
    },

    pray(villager, structure) {
        villager.data.actionType = "praying";
        villager.data.actionTarget = structure;
        villager.data.state = "moving";
    },

    craft(villager, structure) {
        villager.data.actionType = "crafting";
        villager.data.actionTarget = structure;
        villager.data.state = "moving";
    },

    store(villager, structure) {
        villager.data.actionType = "delivering_resources";
        villager.data.actionTarget = structure;
        villager.data.state = "moving";
    }
};