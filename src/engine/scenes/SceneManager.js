// transiciones:
import worldState from "../../game/world/WorldState";
import backSceneState from "./BackSceneState";
import TileMap from "../../game/world/TileMap";
import generateSeed from "../../game/world/Seed";
import gameState from "../../game/state/GameStateG";
import { generateTrees, generateRocks, generateRuins, generateStatues } from "../../game/faceB/LogicB";
import { emit } from "../../utils/events";
import createTower from "../../game/faceA/entities/Tower";
import { createDefenseTower } from "../../game/faceA/entities/ManifestABuildings";
import createCenterTown from "../../game/faceB/entities/CenterTown";
import { upgradeLogicianState } from "../../game/progression/UpgradeState";
import { tutorial } from "../../game/tutorials/TutorialState";
import gameStateA from "../../game/faceA/state/GameStateA";
import { hideHint } from "../../game/tutorials/tutorials";

export default function generateFaceB() {
    if (!gameState.firstRun) return;

    if (!worldState.seed) {
        worldState.seed = generateSeed();
        worldState.tileMap = new TileMap(
            worldState.grid.width,
            worldState.grid.height,
            worldState.seed,
            worldState.grid.cellSize
        );

        generateTrees(worldState.tileMap, worldState);
        generateRocks(worldState.tileMap, worldState);
        generateRuins(worldState.tileMap, worldState);
        generateStatues(worldState.tileMap, worldState);
    }
}

export function changeToA() {
    //sacar la torre del backScene
    const tower = backSceneState.structures.find(s => s.id === "tower");

    //resetear backscene
    backSceneState.entities = [];
    backSceneState.structures = [];
    backSceneState.scenographics = [];
    backSceneState.reservedBy = [];

    //hacer una copia de lo que voy a borrar:
    backSceneState.entities = worldState.entities.filter(
        e => e.type === "villager"
    );

    const idsToSave = [
        "protagonist",
        "logician",
        "logistician",
        "centerTown"
    ];

    backSceneState.structures = worldState.structures.filter(
        s => idsToSave.includes(s.id) || s.data.referenceId === "silo"
    );

    //guardar el id reservedBy para poder reatribuirlo al restaurar B
    for(const structure of worldState.structures) {
        if(structure.data.reservedBy) {
            const reserved = structure.data.reservedBy;
            backSceneState.reservedBy.push(reserved);
        }

        continue;
    }

    for(const scenographic of worldState.scenographics) {
        if(scenographic.data.reservedBy) {
            const reserved = scenographic.data.reservedBy;
            backSceneState.reservedBy.push(reserved);
        }

        continue;
    }

    //limpiar cosas:
    gameState.selectedEntityId = null;

    for(const structure of worldState.structures) {
        if(structure.data.reservedBy) {
            structure.data.reservedBy = null;
        }

        continue;
    }

    for(const scenographic of worldState.scenographics) {
        if(scenographic.data.reservedBy) {
            scenographic.data.reservedBy = null;
        }

        continue;
    }

    worldState.entities = worldState.entities.filter(
        e => e.type !== "villager"
    );

    worldState.structures = worldState.structures.filter(
        s =>
            s.id !== "protagonist" &&
            s.id !== "logician" &&
            s.id !== "logistician" &&
            s.id !== "centerTown" &&
            s.data.referenceId !== "silo"
    );

    emit("closeModal");

    //crear cosas:
    if(tower) {
        tower.data.hp = tower.data.hpMax;
        worldState.structures.push(tower);
    } else {
        worldState.structures.push(createTower());
    }
    
    const silos = backSceneState.structures.filter(s => s.data?.referenceId === "silo");

    for (const silo of silos) {
        worldState.structures.push(createDefenseTower(
            silo.x,
            silo.y,
            silo.id
        ))
    }


    //hacer el cambio:
    gameState.currentFace = "A";
    gameState.currentTime = 60;
    if(gameState.firstRun) gameState.firstRun = false;
    tutorial.returnToAUsed = true;
    tutorial.BtutorialComplete = true;
    if(gameStateA.hint.active) {
        hideHint();
    }
    gameState.gamePause = false;
    gameState.transitioning = false;
}

export function changeToB() {
    //guardar lo que hace falta para regenerar B: por ahora sólo las defenseTowers
    const Atowers = worldState.structures.filter(s => s.data.referenceId === "defenseTower");
    const villagerHouses = worldState.structures.filter(s => s.data.referenceId === "villagerHouse");
    const sundial = worldState.structures.find(s => s.id === "sundial");

    const tower = worldState.structures.find(s => s.id === "tower");

    if (tower && !backSceneState.structures.some(s => s.id === "tower")) {
        backSceneState.structures.push(tower);
    }

    //limpiar A
    emit("closeModal");

    worldState.entities = [];
    worldState.structures = [];
    worldState.scenographics = worldState.scenographics.filter(
        s => s.type !== "projectile"
    );

    upgradeLogicianState.clickMultiplier = 1;
    upgradeLogicianState.passiveExp = 0;
    upgradeLogicianState.activeUpgrades = [];


    //preparar
    if(gameState.firstRun) {
        //crear cosas
        if (!worldState.tileMap) {
            worldState.structures.push(createCenterTown());
            generateFaceB();
        }        
    } else {
        //consultar backSceneState
        const centerTown = backSceneState.structures.find(s => s.id === "centerTown");

        if(centerTown) worldState.structures.push(centerTown);

        const statues = backSceneState.structures.filter(
            s => ["protagonist", "logician", "logistician"].includes(s.id)
        );

        if(statues) {
            for(const statue of statues) {
                worldState.structures.push(statue);
            }
        }

        if(sundial) {
            worldState.structures.push(sundial);
        }

        if(Atowers.length > 0) {
            for (const atower of Atowers) {
                const silo = backSceneState.structures.find(s => s.id === atower.data.sourceId);

                worldState.structures.push(silo);
            }
        }

        if(villagerHouses.length > 0) {
            for (const villagerHouse of villagerHouses) {
                worldState.structures.push(villagerHouse);
            }
        }

        const villagers = backSceneState.entities.filter(e => e.type === "villager");

        if(villagers.length > 0) {
            for(const villager of villagers) {
                worldState.entities.push(villager);
            }

            //reservedBys
            for (const villager of worldState.entities) {
                const target = villager.data.actionTarget;

                if (target) {
                    target.data.reservedBy = villager.id;
                }
            }
        }
    }

    //cambiar de face

    //bonus de EXP para poder llegar a pasar a A de nuevo
    if(gameState.firstRun) {
        gameState.currentExp += 200;
    }

    gameState.currentFace = "B";
    gameState.statistics.timeOfRun = 0;
    gameState.statistics.totalExpOfRun = 0;
    gameState.selectedEntityId = null;
    gameState.transitioning = false;
    gameState.gamePause = false;
}

export function changeToM() {
    //limpiar
    worldState.entities = [];
    worldState.structures = [];

    //resetear
    gameStateA.hint.active = false;
    gameStateA.hint.type = null;
    gameStateA.hint.targetId = null;
    gameStateA.hint.x = 0;
    gameStateA.hint.y = 0;
    gameStateA.hint.startTime = 0;

    tutorial.step = 0;
    tutorial.towerClicked = false;
    tutorial.cameraMoved = false,

    tutorial.archetypeButtonClicked = false,
    tutorial.archetypeSummoned = false,

    tutorial.archetypeMoved = false,

    tutorial.firstPortal = true,

    tutorial.shadowClicked = false,

    tutorial.AtutorialComplete = true;

    //cambiar
    gameState.currentExp = 0;
    gameState.currentTime = 60;
    gameState.currentFace = "M";
    gameState.gameStart = false,
    gameState.activeProcesses = [];
    gameState.selectedEntityId = null;
    gameState.statistics.totalExpOfRun = 0;
    gameState.statistics.timeOfRun = 0;
    gameState.transitioning = false;
    gameState.gamePause = false;
}