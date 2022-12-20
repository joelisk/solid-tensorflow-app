import { Component, createSignal, createEffect } from "solid-js";
import getStyledImage from "./model";
import { Canvas } from "./Canvas";

const styledId = "styledImage";

// const BASE_URL = import.meta.env.PROD
//   ? "https://joelisk.github.io/solid-tensorflow-app"
//   : "http://localhost:3000";

import hiddenImage from "./assets/spengbab.jpg";
import img1 from "./assets/Golden_Gate_Bridge_from_Battery_Spencer.jpg";
import img2 from "./assets/The_Great_Wave_off_Kanagawa.jpg";
import img3 from "./assets/Tuebingen_Neckarfront.jpg";
import img4 from "/src/assets/Untitled_(Still_life)_(1913)_-_Amadeo_Souza-Cardoso_(1887-1918)_(17385824283).jpg";

const imgUrlArr = [img1, img2, img3, img4];

// const imgUrlArr = [
//   BASE_URL + "/src/assets/Golden_Gate_Bridge_from_Battery_Spencer.jpg",
//   BASE_URL + "/src/assets/The_Great_Wave_off_Kanagawa.jpg",
//   BASE_URL + "/src/assets/Tuebingen_Neckarfront.jpg",
//   BASE_URL +
//     "/src/assets/Untitled_(Still_life)_(1913)_-_Amadeo_Souza-Cardoso_(1887-1918)_(17385824283).jpg",
// ];

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

const changeTgtImage = (imgIdx: number) => {
  setImage(imgUrlArr[imgIdx]);
};

const changeStyleImage = (imgIdx: number) => {
  setStyleImage(imgUrlArr[imgIdx]);
};

const App: Component = () => {
  // app will crash mobile
  if (detectMob()) {
    return (
      <div class="text-violet-100">
        Sorry, app is currently not working on mobile.
      </div>
    );
  } else {
    return (
      <div>
        <header class="pr-2 pl-24 py-0 font-sans text-2xl text-violet-100 bg-gradient-to-b from-indigo-500 to-fuchsia-500">
          <div>
            <div class="px-4 py-2 container bg-gray-800">
              <div class="flex justify-center py-8">Art Style Transfer!</div>
              {/* Thumbnails & Main Images */}
              <div class="pb-6 columns-2 flex justify-evenly">
                <div class="text-sm">
                  Choose your target image!
                  <Sidebar imgChange={changeTgtImage} />
                </div>
                <div class="pt-5">
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
                  <Sidebar imgChange={changeStyleImage} />
                </div>
                <div class="pt-5">
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
  }
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
                <img class="rounded" src={value} width={100} height={100} />
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

// quick check for mobile. TensorFlow.js currently
// crashing on mobile browsers
function detectMob() {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
}
