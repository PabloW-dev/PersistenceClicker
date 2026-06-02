import gameState from "../state/GameStateG";


export const metaResources = {
    socialRewards: {
        portfolio: false,
        github: false,
        linkedin: false,
        twitter: false,
        instagram: false
    }
}

export function applySocialRewards() {
    let bonus = 0;

    Object.values(metaResources.socialRewards).forEach(reward => {
        if(reward) bonus += 15;
    })

    gameState.currentExp += bonus;
}