import { Component, createSignal, createEffect } from "solid-js";
import getStyledImage from "./model";
import { Canvas } from "./Canvas";

// will change if we deploy to Heroku, Github pages, etc...
// const image = "http://localhost:3000/src/assets/image.jpg"
// maybe have an env file + global constants
const styledId = "styledImage";

// for more chaos, could have a different hiddenImage associated with every styleImage
const hiddenImage = "http://localhost:3000/src/assets/spengbab.jpg";

const imgUrlArr = [
  "http://localhost:3000/src/assets/image.jpg",
  "http://localhost:3000/src/assets/style_transfer_image.jpg",
];

// for some reason if we don't have the hiddenImage in the
// app, tf.browser.toPixels() just displays a gray screen
// so we need to have the image in the App Component
// but set the display to 'hidden'

const [canvasDisplayed, setCanvasDisplayed] = createSignal(false);
const [buttonPressed, setButtonPressed] = createSignal(false);
const [image, setImage] = createSignal(imgUrlArr[0]);
const [styleImage, setStyleImage] = createSignal(imgUrlArr[1]);
const [modelFailure, setModelFailure] = createSignal(false);

const styledImage = async (id: string) => {
  setButtonPressed(true);
  try {
    // model fails ~20% of the time. let's be safe
    // also we should make sure to free up memory
    // by disposing of unneeded tensors
    await getStyledImage(styleImage(), hiddenImage, id).then((result) => {
      console.log(result);
    });

    setCanvasDisplayed(true);
  } catch (error) {
    console.log(error);
    setModelFailure(true);
  }

  setCanvasDisplayed(true);
};

const changeLImage = (imgIdx: number) => {
  setImage(imgUrlArr[imgIdx]);
};

const changeRImage = (imgIdx: number) => {
  setStyleImage(imgUrlArr[imgIdx]);
};

//TODO: make the styling look good
//TODO: button working, have 3-4 styleImages in a sidebar to choose from

const App: Component = () => {
  return (
    <div>
      {/*<div class="container pt-24 md:pt-36 mx-auto flex flex-wrap flex-col md:flex-row items-center">*/}
      <header class="pr-2 pl-24 py-0 font-sans text-2xl text-violet-100 bg-gradient-to-b from-indigo-500 to-fuchsia-500">
        <div>
          <div class="px-4 py-2 container bg-gray-800">
            <div class="flex justify-center py-8">Art Style Transfer!</div>
            {/* Thumbnails & Main Images */}
            <div class="pb-6 columns-2 flex justify-evenly">
              <div class="text-sm">
                Choose your target image!
                <Sidebar imgChange={changeLImage} />
              </div>
              <div>
                <img
                  class="rounded-lg transform transition duration-500 hover:scale-110"
                  src={image()}
                  width={500}
                  height={500}
                />
              </div>
            </div>
            <div class="pb-6 columns-2 flex justify-evenly">
              <div class="text-sm">
                Choose your style image!
                <Sidebar imgChange={changeRImage} />
              </div>
              <div>
                <img
                  class="rounded-lg transform transition duration-500 hover:scale-110"
                  src={styleImage()}
                  width={500}
                  height={500}
                />
              </div>
            </div>
            <div class="invisible">
              <img src={hiddenImage} width={5} height={5} />
            </div>
            {/* Bottom */}
            <div class="pt-6 pb-6 flex justify-center">
              <button
                class="p-4 rounded-md border-radius bg-gray-900 hover:border-2 hover:border-white hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
                onClick={() => styledImage(styledId)}
              >
                Generate Image!
              </button>
            </div>
            <div
              class={`ml-[26rem] mr-[26rem] h-[22rem] mt-8 pt-4 flex justify-center ${
                buttonPressed() ? "lg:bg-gray-900" : ""
              }`}
            >
              {modelFailure() ? (
                <ModelFailError />
              ) : (
                <div>
                  {buttonPressed() && !canvasDisplayed() ? (
                    <div class="flex justify-center">
                      <p>Loading...</p>
                    </div>
                  ) : (
                    ""
                  )}
                  {canvasDisplayed() ? (
                    <div class="pb-2 flex justify-center">
                      <p> you have failed the vibe check. </p>
                    </div>
                  ) : (
                    ""
                  )}
                  <div class="flex justify-center">
                    <Canvas id={styledId} />
                  </div>
                  {canvasDisplayed() ? (
                    <div class="pb-2 flex justify-center">
                      <p> he comes. </p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

const Sidebar: Component<{ imgChange: Function }> = (props) => {
  return (
    <aside class="w-64">
      <div class="flex flex-col overflow-y-auto py-4 px-3 rounded bg-gray-900">
        <ul class="space-y-4">
          {imgUrlArr.map((value, index) => {
            return (
              <li
                onClick={() => props.imgChange(index)}
                class="hover:bg-gray-100/5 flex flex-row justify-end"
              >
                <img src={value} width={100} height={100} />
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

const ModelFailError: Component = () => {
  return (
    <div class="bg-red-600 text-wrap">
      Model failed to execute and possible memory leak. Refresh the page to run
      again.
    </div>
  );
};

export default App;

// npm run dev
