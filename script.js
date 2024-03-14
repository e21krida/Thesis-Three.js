import * as THREE from 'three';

const times = [];
let fps;
const canvasContainer = document.querySelector('.canvas-container');

function refreshLoop() {
    window.requestAnimationFrame(() => {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
            times.shift();
        }
        times.push(now);
        fps = times.length;
        refreshLoop();
    });
}

refreshLoop();

function getFPS() {
    return fps || 0;
}

function generateCanvases() {
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
        console.log(`Generating canvas: canvas${i}`);
        generateThree(`canvas${i}`, i);
    }
}

function generateThree(canvasId, canvasNumber) {
    const canvas = document.getElementById(canvasId);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
        console.log(`Canvas ${canvasNumber} - Current FPS:`, getFPS());
    }

    animate();
}

window.onload = function () {
    generateCanvases();
};
