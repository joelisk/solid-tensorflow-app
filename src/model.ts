import * as tf from "@tensorflow/tfjs";
import { getCanvas } from "./Canvas";

const BASE_URL = import.meta.env.PROD
  ? "https://joelisk.github.io/solid-tensorflow-app"
  : "http://localhost:3000";

const modelURL = BASE_URL + "/src/models/model.json";

const getStyledImage = async (
  styleImgURL: string,
  imgURL: string,
  styledId: string
) => {
  console.log("running model...");

  const model = await tf.loadGraphModel(modelURL);

  const image = new Image(240, 258); // need image size small or will crash
  image.src = imgURL;

  const styleImage = new Image(250, 250);
  styleImage.src = styleImgURL;

  const imageTensor = preprocess(image);
  const styleImageTensor = preprocess(styleImage);

  let result = model.execute([styleImageTensor, imageTensor]);

  //Typescript not happy but seems to work. returns a tensor of rank 3
  result = tf.squeeze(result);

  console.log("style transfer completed");

  //Typescript not happy with result
  tf.browser.toPixels(result, getCanvas(styledId));

  const completedMsg = "image completed";

  return completedMsg;
};

function preprocess(
  imgData:
    | HTMLImageElement
    | tf.PixelData
    | ImageData
    | HTMLCanvasElement
    | HTMLVideoElement
    | ImageBitmap
) {
  let imgTensor = tf.browser.fromPixels(imgData);

  //image has 3 channels (0, 255) - need to normalize (0, 1)
  const offset = tf.scalar(255.0);
  const normalized = tf.scalar(1.0).sub(imgTensor.div(offset));

  // model expects an array of tensors
  // create an array containing 1 4-d tensor
  const batched = normalized.expandDims(0);

  return batched;
}

export default getStyledImage;
