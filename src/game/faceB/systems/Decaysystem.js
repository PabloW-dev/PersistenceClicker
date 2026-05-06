//degradation of the world, only runs when B, because A is "atemporal" (good excuse xd)
//this cycle expend a 1 REAL day inside of B, so will needs persistance of the data
import worldState from "../../world/WorldState";
import { TreeStatesManager } from "./MachineStatesB";

const AGE_SPEED = 100 / 86400;

export default function decaySystem(deltaTime) {
    //TO DO: Make general for al things of worldState

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
}