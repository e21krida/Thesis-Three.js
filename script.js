import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scenes = {};
const renderers = {};
const models = {};
const canvasContainer = document.querySelector('.canvas-container');

function generateCanvases() {
    for (let i = 1; i <= 12; i++) {
        const canvasWrapper = document.createElement('div');
        canvasWrapper.classList.add('canvas-wrapper');
        const canvas = document.createElement('canvas');
        canvas.id = `canvas${i}`;
        canvas.width = 700;
        canvas.height = 300;
        canvasWrapper.appendChild(canvas);
        const text = document.createElement('div');
        text.classList.add('canvas-text');
        text.textContent = `Canvas ${i}`;
        canvasWrapper.appendChild(text);

        canvas.addEventListener('click', function() {
            window.location.href=`product.html?canvas=${i}`;
        })

        canvasContainer.appendChild(canvasWrapper);
        console.log(`Generating canvas: canvas${i}`);
        generateThree(`canvas${i}`);
    }
}

function generateThree(canvasId) {
    const canvas = document.getElementById(canvasId);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xCCCCCC);
    scenes[canvasId] = scene;

    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderers[canvasId] = renderer;

    const loader = new GLTFLoader();
    loader.load('models/Stylized Rifle/scene.gltf', function (gltf) {
        models[canvasId] = gltf.scene;
        gltf.scene.position.set(0, -1, 0);
        gltf.scene.scale.set(3, 3, 3);
        scene.add(gltf.scene);
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