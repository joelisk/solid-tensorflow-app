import { Component, createEffect } from 'solid-js';
import styles from './App.module.css';
import getStyledImage from './model';
import { Canvas } from './Canvas';

// will change if we deploy to Heroku, Github pages, etc...
const image = "http://localhost:3000/src/assets/image.jpg"
const styleImage = "http://localhost:3000/src/assets/style_transfer_image.jpg"

const styledImage = async () => {
  await getStyledImage(styleImage, image)
    .then(result => {
      console.log(result);
    });

}

//TODO: make the styling look good
//TODO: button working, have 3-4 styleImages in a sidebar to choose from
//TODO: button working, have an <input> to upload image
//TODO: finally, have button to download image
//TODO: option to share on social media?

const App: Component = () => {
  return (
    <div>
    {/*<div class="container pt-24 md:pt-36 mx-auto flex flex-wrap flex-col md:flex-row items-center">*/}
      <header class={styles.header}>
        {/* Left Col */}
        <div class="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
          <img src={image} width={500} height={500} />
        </div>
        {/* Right Col */}
        <div class="flex flex-col w-full xl:w-3/5 p-12 overflow-hidden">
          <img src={styleImage} width={500} height={500} />
        </div>
        <button onClick={styledImage}>Generate Styled Image!</button>
        <Canvas />
      </header>
    </div>
  );
};

export default App;

// npm run dev