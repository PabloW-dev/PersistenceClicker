import gameState from "../state/GameStateG";


export const metaResources = {
    socialRewards: {
        portfolio: false,
        github: false,
        linkedin: false,
        twitter: false,
        instagram: false
    },

    socialRewardsApplied: {
        portfolio: false,
        github: false,
        linkedin: false,
        twitter: false,
        instagram: false
    },

    tutorialFirstCompleted: false
}

export function applySocialRewards() {

    let bonus = 0;

    Object.keys(metaResources.socialRewards).forEach(key => {
        
        const rewardUnlocked = metaResources.socialRewards[key];

        const alreadyApplied = metaResources.socialRewardsApplied[key];

        if(!rewardUnlocked) return;

        if(alreadyApplied) return;

        bonus += 15;

        metaResources.socialRewardsApplied[key] = true;
    })

    gameState.currentExp += bonus;
}