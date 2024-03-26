import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, model;

const canvasContainer = document.querySelector('.product-canvas-container');

function getURLParam(parameter) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(parameter);
}

document.addEventListener('DOMContentLoaded', function () {
  const modelName = getURLParam('name');
  if (modelName) {
    generateCanvas(modelName);
  }
})

function generateCanvas(modelName) {
  fetch('modelinformation.json')
    .then(response => response.json())
    .then(modelData => {
      const rightModel = modelData.find(row => row.name === modelName);
      const canvasWrapper = document.createElement('div');
      canvasWrapper.classList.add('product-canvas-wrapper');
      const canvas = document.createElement('canvas');
      canvas.classList.add('product-canvas');
      canvas.id = 'canvas1';
      canvas.width = 800;
      canvas.height = 370;
      canvasWrapper.appendChild(canvas);

      const text = document.createElement('div');
      text.classList.add('product-canvas-text');
      text.textContent = modelName;

      const description = document.createElement('p');
      description.classList.add('description');
      description.textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a nibh condimentum, suscipit nunc quis, pharetra neque. Aliquam convallis sed magna at auctor. Vivamus tincidunt luctus dui, at imperdiet purus tincidunt vitae. Phasellus euismod lacus vel quam bibendum, in ultrices velit eleifend. Curabitur eget suscipit eros, et finibus augue. Fusce orci urna, feugiat dictum mollis non, pellentesque id lorem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur rutrum mi at tempor consectetur. Sed sit amet urna vel metus egestas bibendum sed a leo. Pellentesque luctus nisl eu tincidunt vulputate. Fusce facilisis non ligula eu vehicula. Sed fringilla odio id malesuada porttitor. Vestibulum finibus aliquet lectus, et dapibus lacus elementum nec. Nulla lobortis, lectus ut hendrerit pretium.';
      text.appendChild(description);
      canvasWrapper.appendChild(text);
      canvasContainer.appendChild(canvasWrapper);

      // Establishes the reference
      let referenceText = document.createElement('span');
      referenceText.classList.add('product-reference-text');
      canvasWrapper.appendChild(referenceText);

      // References the source of the model.
      let sourceA = document.createElement('a');
      sourceA.textContent = rightModel.references[0].text;
      sourceA.href = rightModel.references[0].href;
      referenceText.appendChild(sourceA);

      let text1 = document.createTextNode(' by ');
      referenceText.appendChild(text1);

      // References the creator of the model.
      let sourceB = document.createElement('a');
      sourceB.textContent = rightModel.references[1].text;
      sourceB.href = rightModel.references[1].href;
      referenceText.appendChild(sourceB);

      let text2 = document.createTextNode(' is licensed under ');
      referenceText.appendChild(text2);

      // References CC BY 4.0
      let sourceC = document.createElement('a');
      sourceC.textContent = 'CC BY 4.0'
      sourceC.href = 'https://creativecommons.org/licenses/by/4.0/';
      referenceText.appendChild(sourceC);

      initializeThree();
      initializeModel(rightModel.path);
      animate();
    });
}

function initializeThree() {
  const canvas = document.getElementById("canvas1");

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xCCCCCC);

  camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 35);

  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set(0, 0.5, 1);
  scene.add(light);
}

function initializeModel(modelPath) {
  const loader = new GLTFLoader();
  loader.load(modelPath, function (gltf) {
    model = gltf.scene;
    scaleModel(model);
    scaleCamera(model, camera);
    scene.add(model);
    renderer.render(scene, camera);
  });
}

// Scaling the model is necessary as all models doesn't hold the same size.
function scaleModel(model) {
  // Creates an invisible box around the object to derive its size, to keep the same ratio.
  const boundingBox = new THREE.Box3().setFromObject(model);
  const size = boundingBox.getSize(new THREE.Vector3());

  // Value is derived from the height of the most "optimal" model, most models have a height low enough to not be affected by this, but some were way too big.
  const targetHeight = 1; 
  const scaleFactor = targetHeight / size.y;
  model.scale.set(scaleFactor, scaleFactor, scaleFactor);
}

// Scaling the camera is necessary as all models doesn't hold the same origin.
function scaleCamera(model, camera) {
  const boundingBox = new THREE.Box3().setFromObject(model);
  const center = boundingBox.getCenter(new THREE.Vector3());
  const size = boundingBox.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = maxDim * 0.9;
  camera.position.set(center.x, center.y, center.z + distance);
  camera.lookAt(center);
}

function animate() {
  requestAnimationFrame(animate);
  if (model) {
    model.rotation.y += 0.005;
  }
  renderer.render(scene, camera);
  if (window.fpsTrackerActive) {
    const fpsEvent = new CustomEvent('logFPS', { detail: `Canvas ${canvasNumber} - Current FPS: ${getFPS()}` });
    window.dispatchEvent(fpsEvent);
  }
}