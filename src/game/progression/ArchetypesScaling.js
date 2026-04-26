export const archetypeScaling = {
    protagonist: {
        hp: lvl => 50 + lvl * 18,
        damage: lvl => 50 + lvl * 10,
    },

    logician: {
        hp: lvl => 30 + lvl * 10,
    },

    logistician: {
        hp: lvl => 40 + lvl * 12,
        damage: lvl => 20 + lvl * 5,
        visionRange: lvl => 120 + lvl * 8,
        attackRange: lvl => 20 + lvl * 2,
    },

    defender: {
        hp: lvl => 80 + lvl * 25,
        defense: lvl => 5 + lvl * 2,
    }
};