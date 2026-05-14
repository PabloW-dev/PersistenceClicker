//profesions of the villagers
// ProfessionSystem.js
import { updateInventorySpace } from "../../../utils/inventory";

export function professionSystem(entity, profession, amount) {

    // crear entrada si no existe (esto lo mete en el objeto de professionEXP)
    entity.data.professionEXP[profession] ??= 0;
    

    // SIN PROFESIÓN → acumular afinidad
    if (!entity.data.profession) {

        entity.data.professionEXP[profession] +=
            amount * entity.data.learningRate;

        if (
            entity.data.professionEXP[profession] >= 100
        ) {

            entity.data.profession = profession;

            entity.data.professionData = {
                level: 1,
                range: "beginner"
            };

            updateProfessionStats(entity);
        }

        return;
    }

    // otra profesión → ignorar
    if (entity.data.profession !== profession) return; //esto hace que la función no se aplique si la actividad no resulta de esa profesion

    // profesión principal
    entity.data.professionEXP[profession] +=
        amount * entity.data.learningRate;

    const prof = entity.data.professionData;

    const required =
        prof.level * 100 * 1.8;

    if (
        entity.data.professionEXP[profession] >= required &&
        prof.level < 3
    ) {
        entity.data.professionEXP[profession] -= required;

        prof.level++;
    }

    updateProfessionStats(entity);
}

function updateProfessionStats(entity) {

    const prof = entity.data.professionData;
    const level = prof.level;

    // RESET A BASE
    entity.data.actionCooldown =
        entity.data.baseActionCooldown;

    entity.data.inventory.carryCapacity =
        entity.data.inventory.baseCarryCapacity;

    entity.data.speed =
        entity.data.baseSpeed;

    entity.data.hpMax =
        entity.data.baseMaxHp;

    entity.data.learningRate =
        entity.data.baseLearningRate;

    // RANGE
    if (level === 1) {
        prof.range = "beginner";

    } else if (level === 2) {
        prof.range = "expert";

    } else if (level === 3) {
        prof.range = "master";
    }

    applyProfessionBuffs(entity);
}

function applyProfessionBuffs(entity) {

    const profession = entity.data.profession;
    const level = entity.data.professionData.level;

    // WOODS / STONES / SCAVENGER
    if (
        profession === "woodcutter" ||
        profession === "stonecutter" ||
        profession === "scavenger"
    ) {

        const cooldownReductionByLevel = [0, 1, 2, 3];
        const carryBonusByLevel = [0, 2, 5, 10];

        entity.data.actionCooldown = Math.max(
            1,
            entity.data.baseActionCooldown -
            cooldownReductionByLevel[level]
        );

        entity.data.inventory.carryCapacity =
            entity.data.inventory.baseCarryCapacity +
            carryBonusByLevel[level];

        updateInventorySpace(entity);
    }

    else if (profession === "deliverer") {
        const speedBonusByLevel = [0, 2, 4, 8];
        const carryBonusByLevel = [0, 2, 5, 10];

        entity.data.speed = entity.data.baseSpeed + speedBonusByLevel[level];
        entity.data.inventory.carryCapacity = entity.data.inventory.baseCarryCapacity + carryBonusByLevel[level];

        updateInventorySpace(entity);
    }

    // FUTURAS PROFESIONES

    else if (profession === "builder") {

        const hpBonusByLevel = [0, 25, 50, 100];
        const cooldownReductionByLevel = [0, 1, 2, 3];

        entity.data.hpMax = entity.data.baseMaxHp + hpBonusByLevel[level];
        entity.data.actionCooldown = Math.max(
            1,
            entity.data.baseActionCooldown -
            cooldownReductionByLevel[level]
        );
    }
}