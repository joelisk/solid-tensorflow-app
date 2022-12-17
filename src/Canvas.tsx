import { Component } from "solid-js";

//TODO: pass id as props without getting 
//TypeScript errors
const id = "styledImage";

export const Canvas: Component = () => <canvas id={id}/>;

export const getCanvas = () => {
    const canvas = document.getElementById(id);
 return canvas;
}
