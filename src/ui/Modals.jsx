// modales y popups para tutoriales, alertas o eventos
// modals and popups for tutorials, alerts or events

import React, { useEffect, useState } from 'react';
import { on } from '../utils/events';
import ArchetypeModal from './modals/ArchetypeModal';
import LogicianModal from "./modals/LogicianModal";
import VillagerModal from './modals/VillagerModal';

export default function Modals() {
    const [modal, setModal] = useState({
        open: false,
        type: null,
        payload: null
    });

    useEffect(() => {
        const offOpen = on("openModal", ({ type, payload }) => {
            setModal({
                open: true,
                type,
                payload
            });
        });

        const offClose = on("closeModal", () => {
            setModal({
                open: false,
                type: null,
                payload: null
            });
        });

        return() => {
            offOpen();
            offClose();
        };
    }, []);

    if (!modal.open) return null;

  return (
    <div id="modal-root" className="modal" >
      {modal.type === "archetype" && (
        <ArchetypeModal entityId={modal.payload.entityId} />
      )}

      {modal.type === "logician" && (
        <LogicianModal entityId="logician" />
      )}

      {modal.type === "villager" && (
        <VillagerModal entityId={modal.payload.entityId} />
      )}
    </div>
  );
}
