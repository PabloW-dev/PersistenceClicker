// componente raíz que envuelve la aplicación en React
// root component that wraps the React application
import React, { useEffect, useState } from "react";
import { emit } from "./utils/events";
import GameRoot from "./ui/components/GameRoot";
import Modals from "./ui/Modals";
import useGameState from "./hooks/useState";
import MenuStart from "./ui/components/MenuStart";
import SaveManager from "./engine/persistence/SaveManager";

export default function App() {
    const start = useGameState();
    const [, setTick] = useState(0);

    useEffect(() => {
        SaveManager.loadMeta();
    }, []);

    useEffect(() => {
        function handleClick(e) {
            const modalContent = document.querySelector(".modal-content");

            if (modalContent && !modalContent.contains(e.target)) {
                emit("closeModal");
            }
        }

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        }
    }, []);

    useEffect(() => {
        const rerender = () => setTick(t => t + 1);

        window.addEventListener("gameStateChange", rerender);

        return () => window.removeEventListener("gameStateChange", rerender);
    }, []);
    
    return(
        <>
            {start.gameStart && start.currentFace !== "M" ? (
                <GameRoot />
            ) : (
                <MenuStart />
            )}
            
            <Modals />
        </>
)};