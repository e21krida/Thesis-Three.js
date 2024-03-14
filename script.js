import * as THREE from 'three';
import Stats from 'stats.js';

console.log("Script loaded");
function generateCanvases() {
  const canvasContainer = document.querySelector('.canvas-container');

  for (let i = 1; i <= 12; i++) {
    const canvasWrapper = document.createElement('div');
    canvasWrapper.classList.add('canvas-wrapper');
    const canvas = document.createElement('canvas');
    canvas.id = `canvas${i}`;
    canvas.width = 800;
    canvas.height = 370;
    canvasWrapper.appendChild(canvas);
    const text = document.createElement('div');
    text.classList.add('canvas-text');
    text.textContent = `Canvas ${i}`;
    canvasWrapper.appendChild(text);
    canvasContainer.appendChild(canvasWrapper);

    const statsContainer = document.createElement('div');
    statsContainer.classList.add('stats-container');
    canvasWrapper.appendChild(statsContainer);
    console.log(`Generating canvas: canvas${i}`);
    generateThree(`canvas${i}`, statsContainer);
  }
}

function generateThree(canvasId, statsContainer) {
  var stats = new Stats();
  stats.showPanel(0);
  statsContainer.appendChild(stats.dom);
  const canvas = document.getElementById(canvasId);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 5;
  const renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00});
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  function animate() {
    stats.begin();
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    stats.end();
  }

  animate();
}

window.onload = function () {
  generateCanvases();
};