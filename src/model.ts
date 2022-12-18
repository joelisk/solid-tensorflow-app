//const tf = require('@tensorflow/tfjs');
import * as tf from '@tensorflow/tfjs'
import { getCanvas } from './Canvas'

// TODO: how to use tensorflowjs without massive memory leaks:
// https://levelup.gitconnected.com/how-to-use-tensorflow-js-without-memory-leaks-273ad16196be
// backend_webgl.ts:1211 High memory usage in GPU: 2614.45 MB, most likely due to a memory leak

// Optional Load the binding:
// Use '@tensorflow/tfjs-node-gpu' if running with GPU.
// @tensorflw/tfjs-node causes errors or aws-sdk, aws-s3, nock - I think this is specifically for backend
// require('@tensorflow/tfjs-node');


// console.log(import.meta.env) // solid.js equivalent of process env
// console.log(import.meta.url)
// if we deploy this we'll need to change the url most likely
// TODO: do a check for import.meta.env.DEV || import.meta.env.PROD 
// and set environment variables for the URL based on where we deploy
// if in dev or deployed to Heroku, Github pages, etc...
const modelURL = 'http://localhost:3000/src/models/model.json';

const getStyledImage = async (styleImgURL: string, imgURL: string, styledId: string) => {
    console.log('running model...')

    const model = await tf.loadGraphModel(modelURL);

    const image = new Image(240, 258); // need image size small or will crash
    image.src = imgURL; 
    //image.onload = () => tf.browser.fromPixels(image);
    
    const styleImage = new Image(250, 250);
    styleImage.src = styleImgURL;
    //styleImage.onload = () => tf.browser.fromPixels(image);

    const imageTensor = preprocess(image);
    const styleImageTensor = preprocess(styleImage);

    let result = model.execute([styleImageTensor, imageTensor]);

    //Typescript not happy but seems to work. returns a tensor of rank 3
    result = tf.squeeze(result);

    console.log('style transfer completed')

    //Typescript not happy with result
    tf.browser.toPixels(result, getCanvas(styledId));

    const completedMsg = 'image completed';

    return completedMsg
}

function preprocess(imgData: HTMLImageElement | tf.PixelData | ImageData | HTMLCanvasElement | HTMLVideoElement | ImageBitmap) {

	let imgTensor = tf.browser.fromPixels(imgData)

	//image has 3 channels (0, 255) - need to normalize (0, 1)
	const offset = tf.scalar(255.0);
	const normalized = tf.scalar(1.0).sub(imgTensor.div(offset));

	// model expects an array of tensors 
	// create an array containing 1 4-d tensor
	const batched = normalized.expandDims(0);

	return batched;

}

export default getStyledImage;
