//actions of the villagers:

import worldState from "../../world/WorldState";
import { TreeStatesManager } from "./MachineStatesB";
import { professionSystem } from "./ProfessionSystem";

export function productionSystem(deltaTime) {

    const TreesToCutting = [];

    for (const entity of worldState.entities) {
        if(entity.type !== "villager") continue;

        entity.data.actionFlash = Math.max(
            0,
            entity.data.actionFlash - deltaTime * 8
        );

        const scenographic = entity.data.actionTarget;

        //RUINS
        if(scenographic?.data?.yearsToErase) {

            if (!entity.data.hiddenInStructure) continue;

            entity.data.hiddenTimer -= deltaTime;

            if (entity.data.hiddenTimer <= 0) {

                entity.data.hiddenInStructure = false;
                entity.collider.radius = 24;

                // loot
                if (scenographic.data.hp > 0) {

                    scenographic.data.hp--;

                    // agua garantizada
                    addItem(entity, "water", 1);

                    // madera opcional
                    if (Math.random() < 0.5) {
                        addItem(entity, "wood", 1);
                    }

                    // piedra opcional
                    if (Math.random() < 0.5) {
                        addItem(entity, "stone", 1);
                    }

                    
                    professionSystem(entity, "scavenger", 1);
                }

                entity.data.actionTarget = null;
                entity.data.actionType = null;
                entity.data.state = "idle";
                entity.data.path = [];
                entity.data.pathIndex = 0;
                entity.data.energy = Math.max(0, entity.data.energy - 10);
                entity.data.water = Math.max(0, entity.data.water - 5);
                entity.data.food = Math.max(0, entity.data.food - 5);    
            }

            continue;
        } 

        //TREES
        if (scenographic?.data?.yearsForRebirth) {
            if (entity.data.path.length > 0) continue;

            entity.data.actionTimer += deltaTime;

            if (
                scenographic.data.hp <= 0 ||
                entity.data.energy < 10 ||
                entity.data.food < 5 ||
                entity.data.water < 5 ||
                entity.data.inventory.freeSpace <= 0
            ) {

                entity.data.actionTarget = null;
                entity.data.actionType = null;
                entity.data.state = "idle";
                entity.data.path = [];
                entity.data.pathIndex = 0;
                entity.data.actionTimer = 0;

                continue;
            }

            if (entity.data.actionTimer >= entity.data.actionCooldown) {
                // loot
                scenographic.data.hp--;

                entity.data.actionFlash = 1;

                addItem(entity, "wood", 1);
                
                professionSystem(entity, "woodcutter", 1);

                if (scenographic.data.state !== "cutting") {
                    TreesToCutting.push(scenographic);
                }

                entity.data.energy = Math.max(0, entity.data.energy - 1);
                entity.data.water = Math.max(0, entity.data.water - 1);
                entity.data.food = Math.max(0, entity.data.food - 1); 
                
                entity.data.actionTimer = 0;
            }

            continue;
        }
            
        //ROCKS AND METALS
        if(scenographic?.data?.yearsForRegenerate) {
            if (entity.data.path.length > 0) continue;

            entity.data.actionTimer += deltaTime;

            if (
                scenographic.data.hp <= 0 ||
                entity.data.energy < 10 ||
                entity.data.food < 5 ||
                entity.data.water < 5 ||
                entity.data.inventory.freeSpace <= 0
            ) {

                entity.data.actionTarget = null;
                entity.data.actionType = null;
                entity.data.state = "idle";
                entity.data.path = [];
                entity.data.pathIndex = 0;
                entity.data.actionTimer = 0;

                continue;
            }

            if (entity.data.actionTimer >= entity.data.actionCooldown) {

                scenographic.data.hp--;

                entity.data.actionFlash = 1;

                if (scenographic.sprite.type === "Stone") {
                    addItem(entity, "stone", 1);
                    professionSystem(entity, "stonecutter", 1);
                }

                entity.data.energy = Math.max(0, entity.data.energy - 2);
                entity.data.water = Math.max(0, entity.data.water - 2);
                entity.data.food = Math.max(0, entity.data.food - 2);

                entity.data.actionTimer = 0;
            }
        }     
    }

    for (const tree of TreesToCutting) {
        TreeStatesManager(tree, "cutting");
    }   
}

function addItem(entity, resource, quantity) {
    const inventory = entity.data.inventory;

    //contar items totales
    const totalItems = Object.values(inventory.items).reduce((sum, amount) => sum + amount, 0);

    //espacio restante
    const freeSpace = Math.max(
        0,
        inventory.carryCapacity - totalItems
    );

    if (freeSpace <= 0) {
        inventory.freeSpace = 0;
        return false;
    }

    //limitar cantidad a espacio
    const amountToAdd = Math.min(quantity, freeSpace);

    if(!inventory.items[resource]) {
        inventory.items[resource] = 0;
    }

    inventory.items[resource] += amountToAdd;

    const newTotalItems = Object.values(inventory.items).reduce((sum, amount) => sum + amount, 0);

    inventory.freeSpace = Math.max(
        0,
        inventory.carryCapacity - newTotalItems
    );

    return true;
}