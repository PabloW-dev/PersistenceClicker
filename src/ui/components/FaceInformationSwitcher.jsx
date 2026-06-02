import React from 'react';
import useGameState from "../../hooks/useState";
import SubHUDA from "./SubHUDA";
import SubHUDB from "./SubHUDB";


export default function FaceInformationSwitcher() {
    const state = useGameState();

    if(state.currentFace === "A" || state.currentFace === "T") return <SubHUDA />
    if(state.currentFace === "B") return <SubHUDB />

  return null;
}
