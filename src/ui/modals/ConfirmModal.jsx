import React from 'react';
import SaveManager from '../../engine/persistence/SaveManager';
import { emit } from '../../utils/events';

export default function ConfirmModal() {
  return (
    <div className="modal-content"
        onMouseDown={(e) => e.stopPropagation()}>
      <p>All saved data will be erased and the game will return to the main menu.
      After that, you can start a new game.
      Are you sure you want to continue?</p>

          <button className="process-button" onClick={() => {
            SaveManager.deleteSave();

            emit("closeModal");
            
            window.location.reload();
            }}>
            Yes
          </button>

          <button className="process-button" onClick={
            () => 
              emit("closeModal")
            }>
            No
          </button>
    </div>
  )
}
