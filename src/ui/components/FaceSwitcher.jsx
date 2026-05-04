import React from 'react';
import useGameState from '../../hooks/useState';
import PanelFaceA from './PanelFaceA';
import PanelFaceB from "./PanelFaceB";

export default function FaceSwitcher() {
    const state = useGameState();

    if(state.currentFace === "A") return  <PanelFaceA />
    if(state.currentFace === "B") return <PanelFaceB />
    
    return null; 
}
