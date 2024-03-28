import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const models = {};
const renderers = {};
let amountofModels = 0;
const canvasContainer = document.querySelector('.canvas-container');

window.onload = function () {
  generateCanvases();
};

function generateCanvases() {
  fetch('modelinformation.json')
    .then(response => response.json())
    .then(modelData => {
      modelData.forEach((model, i) => {
        createCanvases(model, i);
      });
    });
}

function createCanvases(model, index) {
  const canvasId = `canvas${index + 1}`;
  const canvasWrapper = document.createElement('div');
  canvasWrapper.classList.add('canvas-wrapper');
  const canvas = document.createElement('canvas');
  canvas.classList.add('product-canvas');
  canvas.id = canvasId;
  canvas.width = 800;
  canvas.height = 370;
  canvasWrapper.appendChild(canvas);
  const text = document.createElement('div');
  text.classList.add('product-canvas-text');
  text.textContent = model.name;
  canvasWrapper.appendChild(text);
  canvasContainer.appendChild(canvasWrapper);
  canvas.addEventListener('click', function () {
    window.location.href = `product.html?name=${model.name}`;
  });

  initializeThree(canvasId, model.path);
}

function initializeThree(canvasId, modelPath) {
  const canvas = document.getElementById(canvasId);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xCCCCCC);
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 35);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderers[canvasId] = renderer;
  const light = new THREE.PointLight( 0xffffff, 500, 100);
  light.position.set(0, 10, 20);
  scene.add(light);
  initializeModel(modelPath, scene, camera, canvasId);
}

function initializeModel(modelPath, scene, camera, canvasId) {
  const loader = new GLTFLoader();
  loader.load(modelPath, function (gltf) {
    amountofModels++;
    const model = gltf.scene;
    scaleModel(model);
    adjustCamera(model, camera);
    scene.add(model);
    models[canvasId] = model;
    animate(model, renderers[canvasId], camera, scene);
  });
}

function scaleModel(model) {
  let targetHeight = 0.2
  const boundingBox = new THREE.Box3().setFromObject(model);
  const size = boundingBox.getSize(new THREE.Vector3());
  const scaleFactor = targetHeight / size.y;
  model.scale.set(scaleFactor, scaleFactor, scaleFactor);
}

function adjustCamera(model, camera) {
  const boundingBox = new THREE.Box3().setFromObject(model);
  const center = boundingBox.getCenter(new THREE.Vector3());
  const size = boundingBox.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = maxDim * 1;
  camera.position.set(center.x, center.y, center.z + + distance);
  camera.lookAt(center);
}

function animate(model, renderer, camera, scene, canvasId) {
  requestAnimationFrame(() => animate(model, renderer, camera, scene));
  if (model && amountofModels == 12) {
    model.rotation.y += 0.008;
  }
  renderer.render(scene, camera);
  if (window.fpsTrackerActive) {
    const fpsEvent = new CustomEvent('logFPS', { detail: `${canvasId} - Current FPS: ${getFPS()}` });
    window.dispatchEvent(fpsEvent);
  }
}