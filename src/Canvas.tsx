import { Component } from "solid-js";

export const Canvas: Component<{ id: string }> = (props) => (
  <canvas id={props.id} />
);

export const getCanvas = (id: string) => {
  const canvas = document.getElementById(id);
  return canvas;
};
