export const archetypeScaling = {
    protagonist: {
        hp: lvl => 50 + (lvl - 1) * 18,
        maxHp: lvl => 50 + (lvl - 1) * 18,
        damage: lvl => 50 + (lvl - 1) * 10,
    },

    logician: {
        hp: lvl => 50 + (lvl - 1) * 30,
        maxHp: lvl => 50 + (lvl - 1) * 30,
    },

    logistician: {
        hp: lvl => 40 + (lvl - 1) * 12,
        damage: lvl => 20 + (lvl - 1) * 5,
        visionRange: lvl => 120 + (lvl - 1) * 8,
        attackRange: lvl => 20 + (lvl - 1) * 2,
    },

    defender: {
        hp: lvl => 80 + (lvl - 1) * 25,
        defense: lvl => 5 + (lvl - 1) * 2,
    }
};