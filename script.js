import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scenes = {};
const renderers = {};
const models = {};
const canvasContainer = document.querySelector('.canvas-container');

function generateCanvases() {
  fetch('modelinformation.json')
    .then(response => response.json())
    .then(modelData => {
      modelData.forEach((model, i) => {
        const canvasId = `canvas${i + 1}`;
        const canvasWrapper = document.createElement('div');
        canvasWrapper.classList.add('canvas-wrapper');

        const canvas = document.createElement('canvas');
        canvas.id = canvasId;
        canvas.width = 700;
        canvas.height = 300;
        canvasWrapper.appendChild(canvas);

        const text = document.createElement('div');
        text.classList.add('canvas-text');
        text.textContent = `${canvasId}: ${model.name}`;
        canvasWrapper.appendChild(text);

        canvas.addEventListener('click', function () {
          window.location.href = `product.html?name=${model.name}`;
        });

        canvasContainer.appendChild(canvasWrapper);
        generateThree(canvasId, model.path);
      });
    })
    .catch(error => console.error('Error loading models:', error));
}

function normalizeCamera(model, camera) {
  const boundingBox = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  boundingBox.getSize(size);
  const center = new THREE.Vector3();
  boundingBox.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = maxDim * 1.2;
  camera.position.set(center.x, center.y, center.z + distance);
  camera.lookAt(center);
}

function normalizeModelSize(model) {
  const targetSize = 1; 
  const boundingBox = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  boundingBox.getSize(size);
  
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = targetSize / maxDim;

  const center = new THREE.Vector3();
  boundingBox.getCenter(center);
  model.position.sub(center);
  
  model.scale.set(scale, scale, scale);
}

function generateThree(canvasId, modelPath) {
  const canvas = document.getElementById(canvasId);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xCCCCCC);
  scenes[canvasId] = scene;

  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderers[canvasId] = renderer;

  const loader = new GLTFLoader();
  loader.load(modelPath, function (gltf) {
    models[canvasId] = gltf.scene;
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.scale.set(5, 5, 5);
    normalizeModelSize(gltf.scene);
    scene.add(gltf.scene);
    normalizeCamera(gltf.scene, camera);
  }, undefined, function (error) {
    console.error(error);
  });

  const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
  scene.add(light);

  animate(canvasId, renderer, scene, camera);
}

function animate(canvasId, renderer, scene, camera) {
  requestAnimationFrame(() => animate(canvasId, renderer, scene, camera));
  const model = models[canvasId];
  if (model) {
    model.rotation.y += 0.005;
  }
  renderer.render(scene, camera);
  if (window.fpsTrackerActive) {
    const fpsEvent = new CustomEvent('logFPS', { detail: `Canvas ${canvasNumber} - Current FPS: ${getFPS()}` });
    window.dispatchEvent(fpsEvent);
  }
}

window.onload = function () {
  generateCanvases();
};