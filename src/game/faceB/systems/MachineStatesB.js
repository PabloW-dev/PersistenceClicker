//manager of the states of B:
export function TreeStatesManager(scenographique, newState) {
    const tree = scenographique;

    tree.data.isPreErasing = false;
    tree.data.justChangedState = true;

    function getSpriteType(state, species) {
        return state + species;
    }

    tree.data.state = newState;

    if(newState === "young") {
        tree.data.maxHp = 40;
        tree.data.hp = 40;
        tree.data.targetScale = 0.4;
        tree.collider.radius = 24;
    }

    else if(newState === "mature") {
        tree.data.maxHp = 70;
        tree.data.hp = 70;
        tree.data.targetScale = 0.8;
    }

    else if(newState === "old") {
        tree.data.maxHp = 100;
        tree.data.hp = 100;
        tree.data.targetScale = 1.2;
    }

    else if(newState === "dead") {
        tree.data.maxHp = 30;
        tree.data.hp = 30;
        tree.data.targetScale = 0.9;
    }

    else if(newState === "erased") {
        tree.data.maxHp = 0;
        tree.data.hp = 0;
        tree.data.targetScale = 0.01;
        tree.collider.radius = 0;
        tree.data.reservedBy = null;
    }

    tree.sprite.type = getSpriteType(newState, tree.data.species);
}

export function villagerStatesManager(entity, newState) {
    entity.data.state = newState;
}

export function villagerCanMove(entity) {
    return [
        "idle",
        "moving",
        "obtaining_resources",
        "delivering_resources",
        "supervising"
    ].includes(entity.data.state);
}

export function villagerIsBusy(entity) {
    return [
        "obtaining_resources",
        "delivering_resources",
        "building",
        "using_structure",
        "supervising"
    ].includes(entity.data.state);
}