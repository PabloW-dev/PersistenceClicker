//actions of the villagers:

import worldState from "../../world/WorldState";
import { TreeStatesManager } from "./MachineStatesB";
import { professionSystem } from "./ProfessionSystem";
import { updateInventorySpace } from "../../../utils/inventory";
import { BUILDINGS } from "./BuildingsDefinition";

//TO DO: en delivering, la parte de que si el villager no tiene los materiales encima vaya a buscarlos al almacén más cercano, y ya, porque el click en el almacén directamente resulta para depositar resources

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

                entity.data.actionTarget.data.reservedBy = null;
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

                entity.data.actionTarget.data.reservedBy = null;
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

                entity.data.actionTarget.data.reservedBy = null;
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
        
        //DELIVERING
        if(entity.data.actionType === "delivering_resources") {

            if(entity.data.path.length > 0) continue; //si estás andando no hagas

            const structure = entity.data.actionTarget;

            if(!structure) {
                entity.data.state = "idle";
                entity.data.actionType = null;

                continue;
            }

            const requiredMaterials = structure.data.matsRequired;

            const inventory = entity.data.inventory.items;

            for (const material in requiredMaterials) {

                //no hace falta más de este
                if(requiredMaterials[material] <= 0) {
                    continue;
                }

                //al aldeano no le queda o no tiene
                if(!inventory[material]) {
                    continue;
                }

                const needed = requiredMaterials[material];
                const available = inventory[material];

                const amountToDeposit = Math.min(
                    needed,
                    available
                );

                inventory[material] -= amountToDeposit;
                requiredMaterials[material] -= amountToDeposit;

                updateInventorySpace(entity);

                entity.data.actionFlash = 1;

                professionSystem(entity, "deliverer", amountToDeposit);

                //limpiar slots vacíos
                if(inventory[material] <= 0) {
                    delete inventory[material];
                }

                break;
            }

            //comprobar si ya tiene todos los materiales
            const completed = Object.values(requiredMaterials).every(a => a <= 0);

            const referenceSprite = BUILDINGS.find(b => b.id === structure.data.referenceId);
            
            if (!referenceSprite) continue;

            if(completed) {
                structure.data.state = "in_construction";
                structure.sprite.type = referenceSprite.spriteInConstruction;
            }

            //terminar tarea
            structure.data.reservedBy = null;

            entity.data.actionTarget = null;
            entity.data.actionType = null;
            entity.data.state = "idle";
            entity.data.path = [];
            entity.data.pathIndex = 0;

            continue;
        }

        //BUILDING
        if(entity.data.actionType === "building") {
            if(entity.data.path.length > 0) continue; //si estás andando no hagas

            const structure = entity.data.actionTarget;

            if(!structure) {
                entity.data.state = "idle";
                entity.data.actionType = null;

                continue;
            }

            entity.data.actionTimer += deltaTime;

            if (
                structure.data.hp <= 0 ||
                entity.data.energy < 20 ||
                entity.data.food < 10 ||
                entity.data.water < 10
            ) {

                entity.data.actionTarget.data.reservedBy = null;
                entity.data.actionTarget = null;
                entity.data.actionType = null;
                entity.data.state = "idle";
                entity.data.path = [];
                entity.data.pathIndex = 0;
                entity.data.actionTimer = 0;

                continue;
            }

            const villagerHouseCount = worldState.structures.filter(
                s => s.data.referenceId === "villagerHouse"
            ).length;

            const buildPower = Math.max(
                1,
                Math.floor(10 / (1 + villagerHouseCount * 0.15))
            );

            if (entity.data.actionTimer >= entity.data.actionCooldown) {
                // loot
                structure.data.hp += buildPower;

                entity.data.actionFlash = 1;
                
                professionSystem(entity, "builder", 1);

                entity.data.energy = Math.max(0, entity.data.energy - 3);
                entity.data.water = Math.max(0, entity.data.water - 3);
                entity.data.food = Math.max(0, entity.data.food - 3); 
                
                entity.data.actionTimer = 0;
            }

            const referenceSprite = BUILDINGS.find(b => b.id === structure.data.referenceId);
            
            if (!referenceSprite) continue;


            if(structure.data.hp >= structure.data.hpMax) {
                structure.data.state = "build";
                structure.sprite.type = referenceSprite.spriteType;

                //terminar tarea
                structure.data.reservedBy = null;

                entity.data.actionTarget = null;
                entity.data.actionType = null;
                entity.data.state = "idle";
                entity.data.path = [];
                entity.data.pathIndex = 0;
            }

            continue;
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

