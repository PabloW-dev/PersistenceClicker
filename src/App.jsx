// componente raíz que envuelve la aplicación en React
// root component that wraps the React application
import React, { useEffect } from "react";
import { emit } from "./utils/events";
import PanelFaceA from "./ui/components/PanelFaceA";
import HUD from "./ui/components/HUD";
import Modals from "./ui/Modals";

export default function App() {

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
            <h1>PersistenceClicker</h1>
            <h2>Time cannot be beaten... Only delayed...</h2>
            <HUD />
            <PanelFaceA />
            <Modals />
        </>
)};