//degradation of the world, only runs when B, because A is "atemporal" (good excuse xd)
//this cycle expend a 1 REAL day inside of B, so will needs persistance of the data
import worldState from "../../world/WorldState";
import { TreeStatesManager } from "./MachineStatesB";

const AGE_SPEED = 100 / 86400;



export default function decaySystem(deltaTime) {
    const ruinTypes = new Set([
        "RuinOne",
        "RuinTwo",
        "RuinThree"
    ]);

    const ruinsToRemove = [];

    for (const scenographique of worldState.scenographics) {
        
        if (scenographique.data.age === undefined) continue; //because we wants 0 for the count

        if (
            scenographique.data.state === "dead" &&
            scenographique.data.age >= scenographique.data.maxYears - 0.2 &&
            scenographique.data.age <= scenographique.data.maxYears
        ) {

            scenographique.data.age += deltaTime * AGE_SPEED;

            if (!scenographique.data.isPreErasing) {
                scenographique.data.isPreErasing = true;
                scenographique.data.targetScale = 0.1; // <-- solo una vez
            }

            const speed = 1;

            scenographique.data.scale += (scenographique.data.targetScale - scenographique.data.scale) * speed * deltaTime;

            if (Math.abs(scenographique.data.scale - scenographique.data.targetScale) < 0.01) {
                scenographique.data.scale = scenographique.data.targetScale;
            }

            continue;
        }
        
        if (scenographique.data.age > scenographique.data.maxYears) {
            if (scenographique.data.state !== "erased") {
                TreeStatesManager(scenographique, "erased");
            }

            scenographique.data.years += deltaTime * AGE_SPEED;

            if (scenographique.data.years > scenographique.data.yearsForRebirth) {

                scenographique.data.scale = 0;

                TreeStatesManager(scenographique, "young");

                scenographique.data.age = 0;
                scenographique.data.years = 0;

                continue;
            }

            continue;
        }

        scenographique.data.age += deltaTime * AGE_SPEED;

        const age = scenographique.data.age;

        let newState = "young";

        if(age > 85) newState = "dead";
        else if(age > 70) newState = "old";
        else if(age > 20) newState = "mature";


        if (scenographique.data.state !== newState) {
            TreeStatesManager(scenographique, newState);
        }

        if (scenographique.data.justChangedState) {
            scenographique.data.justChangedState = false;
        } else {
            const speed = scenographique.data.state === "erased" ? 0.1 : 1;

            scenographique.data.scale += (scenographique.data.targetScale - scenographique.data.scale) * speed * deltaTime;
        }
    }

    for (const scenographique of worldState.scenographics) {

        if (
            scenographique.data.spriteType !== "Stone" &&
            scenographique.data.spriteType !== "Copper" &&
            scenographique.data.spriteType !== "Tin" &&
            scenographique.data.spriteType !== "Iron"
        ) continue;

        if (!scenographique.data.depleted) continue;

        scenographique.data.years += deltaTime * AGE_SPEED;

        const tile = worldState.tileMap?.getTile(
            scenographique.tileX,
            scenographique.tileY
        );
        
        //Llevar esto al sistema de minería cuando exista:
        if(!scenographique.data.blockMovement) {
            if (tile) {
                tile.structureId = null;
            }

        }

        if (scenographique.data.years >= scenographique.data.yearsForRegenerate) {

            scenographique.data.hp = scenographique.data.maxHp;

            scenographique.data.depleted = false;

            scenographique.data.years = 0;

            scenographique.data.blockMovement = true;

            if (tile) {
                tile.structureId = scenographique.id;
            }
        }
    }

    for (const scenographique of worldState.scenographics) {

        if (!ruinTypes.has(scenographique.data.spriteType)) continue;

        scenographique.data.years += deltaTime * AGE_SPEED;

        if (scenographique.data.years >= scenographique.data.yearsToErase) {
            
            ruinsToRemove.push(scenographique.id);

            const tile = worldState.tileMap?.getTile(
                scenographique.tileX,
                scenographique.tileY
            );

            if (tile?.structureId === scenographique.id) {
                tile.structureId = null;
            }
        }
    }

    if (ruinsToRemove.length > 0) {
        worldState.scenographics =
            worldState.scenographics.filter(
                s => !ruinsToRemove.includes(s.id)
            );
    }
}