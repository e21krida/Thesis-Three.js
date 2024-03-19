import * as THREE from 'three';
const canvasContainer = document.querySelector('.product-canvas-container');

function getURLParam(parameter) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(parameter);
}

document.addEventListener('DOMContentLoaded', function () {
  const canvasNumber = getURLParam('canvas');
  if (canvasNumber) {
    generateCanvas(canvasNumber);
  }
})

function generateCanvas(canvasNumber) {
  const canvasWrapper = document.createElement('div');
  canvasWrapper.classList.add('product-canvas-wrapper');
  const canvas = document.createElement('canvas');
  canvas.classList.add('product-canvas');
  canvas.id = `canvas${canvasNumber}`;
  canvas.width = 800;
  canvas.height = 370;
  canvasWrapper.appendChild(canvas);
  const text = document.createElement('div');
  text.classList.add('product-canvas-text');
  text.textContent = `Canvas ${canvasNumber}`;
  const description = document.createElement("p");
  description.classList.add("description");
  description.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a nibh condimentum, suscipit nunc quis, pharetra neque. Aliquam convallis sed magna at auctor. Vivamus tincidunt luctus dui, at imperdiet purus tincidunt vitae. Phasellus euismod lacus vel quam bibendum, in ultrices velit eleifend. Curabitur eget suscipit eros, et finibus augue. Fusce orci urna, feugiat dictum mollis non, pellentesque id lorem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur rutrum mi at tempor consectetur. Sed sit amet urna vel metus egestas bibendum sed a leo. Pellentesque luctus nisl eu tincidunt vulputate. Fusce facilisis non ligula eu vehicula. Sed fringilla odio id malesuada porttitor. Vestibulum finibus aliquet lectus, et dapibus lacus elementum nec. Nulla lobortis, lectus ut hendrerit pretium.";
  canvasWrapper.appendChild(text);
  text.appendChild(description);
  canvasContainer.appendChild(canvasWrapper);
  console.log(`Generating canvas: canvas${canvasNumber}`);
  generateThree(canvasNumber);
}

function generateThree(canvasNumber) {
  const canvasId = `canvas${canvasNumber}`;
  const canvas = document.getElementById(canvasId);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFFFFFF);
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 5;
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0xfc7526 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
  scene.add(light);

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    if (window.fpsTrackerActive) {
      const fpsEvent = new CustomEvent('logFPS', { detail: `Canvas ${canvasNumber} - Current FPS: ${getFPS()}` });
      window.dispatchEvent(fpsEvent);
    }
  }

  animate();
}