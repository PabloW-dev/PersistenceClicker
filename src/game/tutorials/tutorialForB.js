import gameStateA from "../faceA/state/GameStateA";
import { POPULATION } from "../faceB/systems/PopulationSystem";
import gameState from "../state/GameStateG";
import worldState from "../world/WorldState";
import { tutorial } from "./TutorialState";
import { hideHint, showHint } from "./tutorials";



let timer = 0;

export function updateTutorialB(deltaTime) {
    if(gameState.currentFace !== "B") return;
    if(!gameState.firstRun) return;

    if(!tutorial.townCenterClicked && !gameStateA.hint.active) {
        timer += deltaTime;

        if(timer > 5) {
            showHintOnTownCenter();
        }
    }

    if(POPULATION.villagers.currentPopulation >= 1 && !tutorial.townCenterClicked) {
        tutorial.townCenterClicked = true;

        hideHint();
    }

    if(tutorial.townCenterClicked && !gameStateA.hint.active) {
        showHint({
            type: "dom",
            targetId: "emplacement-sundial"
        });
    }

    const sundial = worldState.structures.find(s => s.id === "sundial");

    if(!sundial) return;

    if(sundial) {
        tutorial.sundialPlaced = true;

        hideHint();
    }

    const villager = worldState.entities.find(e => e.type === "villager");

    if (!villager) return;

    if(!gameStateA.hint.active && !gameState.selectedEntityId && !tutorial.sundialReady) {
        showHint({
            type: "click",
            x: villager.x - 10,
            y: villager.y - 40
        });
    }

    const tree = worldState.scenographics
        .filter(s => s.data.yearsForRebirth)
        .sort((a, b) => {
            const distA = Math.hypot(a.x - villager.x, a.y - villager.y);
            const distB = Math.hypot(b.x - villager.x, b.y - villager.y);

            return distA - distB;
        })[0];

    if(!tree) return;

    if(gameState.selectedEntityId && !tutorial.sundialReady) {
        hideHint();

        if(tree) {
            showHint({
                type: "click",
                x: tree.x - 10,
                y: tree.y - 40
            });
        }
    }
    
    if(villager.data.actionTarget) {
        hideHint();
    }

    if(villager.data.inventory.freeSpace <= 0 && gameState.selectedEntityId && !tutorial.sundialReady) {
        showHint({
            type: "click",
            x: sundial.x - 10,
            y: sundial.y - 40
        });
    }

    if(sundial.data.state === "in_construction") {
        tutorial.sundialReady = true;
    }

    if(tutorial.sundialReady && !gameState.selectedEntityId && !gameStateA.active && villager.data.actionTarget !== sundial && !tutorial.sundialBuilt) {
        showHint({
            type: "click",
            x: villager.x - 10,
            y: villager.y - 40
        });
    }

    if(gameState.selectedEntityId && tutorial.sundialReady && !tutorial.sundialBuilt) {
        hideHint();

        showHint({
            type: "click",
            x: sundial.x - 10,
            y: sundial.y - 40
        });
    }

    if(sundial.data.hp >= sundial.data.hpMax && !tutorial.sundialBuilt) {
        tutorial.sundialBuilt = true;
        hideHint();
    }

    if(tutorial.sundialBuilt && !gameStateA.hint.active) {
        showHint({
            type: "click",
            x: sundial.x - 10,
            y: sundial.y - 40
        });
    }

    if(!tutorial.sundialBuilt && (villager.data.energy <= 20 || villager.data.food <= 10 || villager.data.water <= 10)) {
        if(gameStateA.hint.active) {
            hideHint();
        }
        if(!gameStateA.hint.active) {
            showHintOnTownCenter();
        }
    }

    if(POPULATION.villagers.currentPopulation >= 2 && !tutorial.sundialBuilt) {
        hideHint();
    }
}


function showHintOnTownCenter() {
    const townCenter = worldState.structures.find(s => s.type === "centerTown");

    if (!townCenter) return;

    showHint({
        type: "click",
        targetId: townCenter.id,
        x: townCenter.x - 20,
        y: townCenter.y - 70
    });
}