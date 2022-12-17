import { Component, createEffect } from 'solid-js';
import styles from './App.module.css';
import getStyledImage from './model';
import * as tf from '@tensorflow/tfjs';

// will change if we deploy to Heroku, Github pages, etc...
const image = "http://localhost:3000/src/assets/image.jpg"
const styleImage = "http://localhost:3000/src/assets/style_transfer_image.jpg"

// TODO: find less janky way to display model
// the whole point of a framework is to not
// have to use document.getElementById()
// see if we can avoid importing tensorflow in this folder
//TODO: have as a component w/ conditional render
let styledIm = null;

const styledImage = async () => {
  await getStyledImage(styleImage, image)
    .then(result => {
      let canvas = document.getElementById("styledImage");
      // renders, but TypeScript is not happy
      tf.browser.toPixels(result, canvas);
    });
}

//doing components
// const ImageInput: Component = (...props) => {
//   const stuff = "thing";
//   return(
//     <div>
//       {stuff}
//       <input />
//     </div>
//   );
// };
//does solid.js have props?
//<ImageInput thing={props.thing} thing2={props.thing2}/>

//TODO: once model working, wrap execution of model in a button "Generate Image"
//TODO: button working, have 3-4 styleImages in a sidebar to choose from
//TODO: button working, have an <input> to upload image
//TODO: finally, have button to download image
//TODO: option to share on social media?

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        {/*<img src={logo} class={styles.logo} alt="logo" />*/}
        <img src={image} />
        <img src={styleImage} />
        <button onClick={styledImage}>Generate Styled Image!</button>
        <canvas id="styledImage"/>
        <p class="text-4xl text-red-400 tracking-widest">
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  );
};

export default App;

// npm run dev