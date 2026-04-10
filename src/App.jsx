// componente raíz que envuelve la aplicación en React
// root component that wraps the React application
import React, { useEffect } from "react";
import startLoop from "./hooks/useGameLoop.js";
import { plusTime } from "./utils/events.js";

export default function App() {

    useEffect(() => {
        startLoop();
    }, []);

    function handleClick() {
        plusTime();
    }


    return(
        <>
            <h1>PersistenceClicker</h1>
            <h2>Time cannot be beaten... Only delayed...</h2>

            <div onClick={handleClick}>
                GAME
            </div>
        </>
)};