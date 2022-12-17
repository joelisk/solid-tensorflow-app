import { Component, createSignal, createEffect } from 'solid-js';
import styles from './App.module.css';
import getStyledImage from './model';
import { Canvas } from './Canvas';

// will change if we deploy to Heroku, Github pages, etc...
const image = "http://localhost:3000/src/assets/image.jpg"
const hiddenImage = "http://localhost:3000/src/assets/spengbab.jpg"
const styleImage = "http://localhost:3000/src/assets/style_transfer_image.jpg"

// for some reason if we don't have the hiddenImage in the 
// app, tf.browser.toPixels() just displays a gray screen
// so we need to have the image in the App Component
// but set the display to 'hidden'

const [canvasDisplayed, setCanvasDisplayed] = createSignal(false);
const [buttonPressed, setButtonPressed] = createSignal(false);

const styledImage = async () => {

  setButtonPressed(true);

  await getStyledImage(styleImage, hiddenImage)
    .then(result => {
      console.log(result);
    });

  setCanvasDisplayed(true);
}

//TODO: make the styling look good
//TODO: button working, have 3-4 styleImages in a sidebar to choose from
//TODO: button working, have an <input> to upload image
//TODO: finally, have button to download image
//TODO: option to share on social media?

// use <button onClick={() => styledImage("styledImage")} pattern to pass arguments

const App: Component = () => {
  return (
    <div>
    {/*<div class="container pt-24 md:pt-36 mx-auto flex flex-wrap flex-col md:flex-row items-center">*/}
      <header class={styles.header}>
        <div class="pt-2 pb-2">
          Choose your vibe!
        </div>
          {/* Left Col */}
          <div class="flex flex-col w-full xl:w-1/4 justify-center lg:items-start overflow-y-hidden">
            <img src={image} width={500} height={500} />
          </div>
          {/* Right Col */}
          <div class="flex flex-col w-full xl:w-1/4 justify-center lg:items-start">
            <img src={styleImage} width={500} height={500} />
          </div>
          <div class="invisible">
            <img src={hiddenImage} width={5} height={5} />
          </div>
          <div class="pt-6 pb-6">
            <button class="p-2 rounded-md border-radius bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300" 
              onClick={styledImage}>Generate Vibe!</button>
          </div>
          {buttonPressed() && !canvasDisplayed() ? <p>Loading...</p> : ''}
          {canvasDisplayed() ? <p> you have failed the vibe check. </p> : ''}
          <Canvas />
          {canvasDisplayed() ? <p> he comes. </p> : ''}
      </header>
    </div>
  );
};

export default App;

// npm run dev