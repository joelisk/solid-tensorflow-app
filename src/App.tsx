import { Component, createSignal, createEffect } from 'solid-js';
import styles from './App.module.css';
import getStyledImage from './model';
import { Canvas } from './Canvas';

// will change if we deploy to Heroku, Github pages, etc...
// const image = "http://localhost:3000/src/assets/image.jpg"
// maybe have an env file + global constants
const styledId = "styledImage";

// for more chaos, could have a different hiddenImage associated with every styleImage
const hiddenImage = "http://localhost:3000/src/assets/spengbab.jpg"

const imgUrlArr = [
  "http://localhost:3000/src/assets/image.jpg",
  "http://localhost:3000/src/assets/style_transfer_image.jpg"
];

// for some reason if we don't have the hiddenImage in the 
// app, tf.browser.toPixels() just displays a gray screen
// so we need to have the image in the App Component
// but set the display to 'hidden'

const [canvasDisplayed, setCanvasDisplayed] = createSignal(false);
const [buttonPressed, setButtonPressed] = createSignal(false);
const [image, setImage] = createSignal(imgUrlArr[0])
const [styleImage, setStyleImage] = createSignal(imgUrlArr[1]);
const [modelFailue, setModelFailure] = createSignal(false);

const styledImage = async (id: string) => {

  setButtonPressed(true);
  try { // model fails ~20% of the time. let's be safe
    // also we should make sure to free up memory
    // by disposing of unneeded tensors
    await getStyledImage(styleImage(), hiddenImage, id)
    .then(result => {
      console.log(result);
    });

    setCanvasDisplayed(true);
    
  } catch (error) {
    console.log(error)
    setModelFailure(true);
  }

  setCanvasDisplayed(true);
}

const changeLImage = (imgIdx: number) => {

  setImage(imgUrlArr[imgIdx]);
}

const changeRImage = (imgIdx: number) => {

  setStyleImage(imgUrlArr[imgIdx]);
}

//TODO: make the styling look good
//TODO: button working, have 3-4 styleImages in a sidebar to choose from
//TODO: button working, have an <input> to upload image - nah, we'll do it with full stack app
//TODO: finally, have button to download image - maybe save for full stack
//TODO: option to share on social media? - maybe save for full stack

const App: Component = () => {
  return (
    <div>
    {/*<div class="container pt-24 md:pt-36 mx-auto flex flex-wrap flex-col md:flex-row items-center">*/}
      <header class="p-6 rounded-md font-sans text-2xl text-violet-100 bg-gradient-to-r from-indigo-500 to-fuchsia-500">
        <div class="container flex flex-wrap flex-col md:flex-row items-center">
          <div class="px-4 py-2 container rounded-lg bg-neutral-800">
              <div class="flex justify-center">
                Art Style Transfer! 
              </div>
              {/* Thumbnails */}
              <div class="columns-2">
                <div>
                  Choose your target image!
                  <Sidebar imgChange={changeLImage} />
                </div>
                <div>
                  Choose your style image!
                  <Sidebar imgChange={changeRImage} />
                </div>
              </div>
              {/* Main Images */}
              <div class="border-2 border-white columns-2">
                <div class="border-2 border-x-white border-b-white">
                  Target Image
                  <img src={image()} width={500} height={500} />
                </div>
                <div class="border-2 border-x-white border-b-white">
                  Style Image
                  <img src={styleImage()} width={500} height={500} />
                </div>
                <div class="invisible">
                  <img src={hiddenImage} width={5} height={5} />
                </div>
              </div>
              {/* Bottom */}
              <div class="pt-6 pb-6 flex justify-center">
                <button class="p-2 rounded-md border-radius bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300" 
                  onClick={() => styledImage(styledId)}>Generate Image!</button>
              </div>
              {
                modelFailue() 
                ? <ModelFailError />  
                : <div>
                  {buttonPressed() && !canvasDisplayed() ? <p class={styles.logo}>Loading...</p> : ''}
                  {canvasDisplayed() ? <p> you have failed the vibe check. </p> : ''}
                  <Canvas id={styledId}/>
                  {canvasDisplayed() ? <p> he comes. </p> : ''}
                </div>
              }
          </div>
          
        </div>
      </header>
    </div>
  );
};

const Sidebar: Component<{imgChange: Function}> = (props) => {
  return (
    <aside class="w-64">
       <div class="flex flex-col overflow-y-auto py-4 px-3 rounded bg-gray-800">
          <ul class="space-y-4">
            {imgUrlArr.map((value, index) => {
              return(<li onClick={() => props.imgChange(index)} class="hover:bg-gray-100/5">
                        <img src={value}  width={100} height={100}/>
            </li>)})}
          </ul>
        </div>
    </aside>
  );
};

const ModelFailError: Component = () => {
  return (
    <div class="bg-red-600 text-wrap">
      Model failed to execute and possible memory leak. Refresh the page to run again.
    </div>
  );
};


export default App;

// npm run dev