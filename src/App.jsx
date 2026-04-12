// componente raíz que envuelve la aplicación en React
// root component that wraps the React application
import React from "react";
import PanelFaceA from "./ui/components/PanelFaceA";
import HUD from "./ui/components/HUD";

export default function App() {
    

    return(
        <>
            <h1>PersistenceClicker</h1>
            <h2>Time cannot be beaten... Only delayed...</h2>
            <HUD />
            <PanelFaceA />
        </>
)};