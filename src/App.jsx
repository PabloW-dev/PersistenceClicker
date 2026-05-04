// componente raíz que envuelve la aplicación en React
// root component that wraps the React application
import React, { useEffect } from "react";
import { emit } from "./utils/events";
import GameRoot from "./ui/components/GameRoot";
import Modals from "./ui/Modals";
import useGameState from "./hooks/useState";

export default function App() {
    const start = useGameState();

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

    return(
        <>
            {start.gameStart ? (
                <GameRoot />
            ) : (
                <>
                    <h1>PersistenceClicker</h1>
                    <h2>Time cannot be beaten... Only delayed...</h2>
                </>
            )}
            
            <Modals />
        </>
)};