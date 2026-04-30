//upgrades for the logician:

export const LOGICIAN_UPGRADES = [
    {
        id: "click_power",
        name: "x2 time per click",
        type: "instant",
        duration: 15,
        effect: (entity, upgradeState) => {
            upgradeState.clickMultiplier = 2;
        }
        //añadir condición para que se muestre disponible
    },

    {
        id: "EXP_generation",
        name: "passive EXP",
        type: "instant",
        duration: 30,
        effect: (entity, upgradeState) => {
            upgradeState.passiveExp = 0.02;
        }
        //añadir condición para que se muestre disponible
    }
];