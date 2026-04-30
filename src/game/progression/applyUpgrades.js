import { upgradeLogicianState } from "./UpgradeState";
import worldState from "../world/WorldState";

export function applyUpgrade(archetype, upgrade) {
    const entity = worldState.entities.find(e => e.id === "logician");

    if(!entity) return;

    //marcar en el array
    upgradeLogicianState.activeUpgrades.push(upgrade.id);

    // ejecutar el efecto
    upgrade.effect(entity, upgradeLogicianState);

    // volver a idle
    entity.data.state = "idle";
}