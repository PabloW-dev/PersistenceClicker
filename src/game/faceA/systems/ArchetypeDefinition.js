//definition of archetypes (in systems because is an authomatism in some way)

import backSceneState from "../../../engine/scenes/BackSceneState";
import gameState from "../../state/GameStateG";
import { createTheProtagonist, createTheLogician, createTheLogistician } from "../entities/Archetypes";
import { createEchoProtagonist } from "../entities/Enemies";


export const ARCHETYPES = [
    {
        id: "protagonist",
        name: "The Protagonist",
        summoningDuration: 10,
        spriteType: "protagonist",
        factory: createTheProtagonist,

        echoFactory: (x, y) =>
            createEchoProtagonist(x, y, "echoProtagonist"),

        shouldShowArchetype: () => {
            if(gameState.firstRun) {
                return gameState.statistics.timeOfRun > 15;
            } else {
                return backSceneState.structures.some(
                s => s.id === "logistician") && 
                gameState.statistics.timeOfRun > 15;
            }
        },


        getLevelUpDuration: (level) => {
            return Math.floor(10 * Math.pow(1.6, level - 1));
        },

        getCurrentResurrectionDuration: (lastResurrection) => {
            return Math.floor(10 * Math.pow(1.6, lastResurrection - 1));
        }
    },

    {
        id: "logician",
        name: "The Logician",
        summoningDuration: 30,
        spriteType: "logician",
        factory: createTheLogician,

        echoFactory: null, //TO DO

        shouldShowArchetype: () => {
            if(gameState.firstRun) {
                return gameState.statistics.totalExpOfRun > 10;
            } else {
                return backSceneState.structures.some(
                s => s.id === "logistician") && 
                gameState.statistics.totalExpOfRun > 10;
            }
        },

        getLevelUpDuration: (level) => {
            return Math.floor(30 * Math.pow(1.6, level - 1));
        },

        getCurrentResurrectionDuration: (lastResurrection) => {
            return Math.floor(30 * Math.pow(1.6, lastResurrection - 1));
        }
    },

    {
        id: "logistician",
        name: "The Logistician",
        summoningDuration: 120,
        spriteType: "logistician",
        factory: createTheLogistician,

        //echoFactory: TO DO

        shouldShowArchetype: () => {
            if(gameState.firstRun) {
                return gameState.statistics.timeOfRun > 180;
            } else {
                return backSceneState.structures.some(
                s => s.id === "logistician") && 
                gameState.statistics.timeOfRun > 180;
            }
        },


        getLevelUpDuration: (level) => {
            return Math.floor(10 * Math.pow(1.6, level - 1));
        },

        getCurrentResurrectionDuration: (lastResurrection) => {
            return Math.floor(10 * Math.pow(1.6, lastResurrection - 1));
        }
    },
];