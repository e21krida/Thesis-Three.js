import * as THREE from 'three';
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
        generateThree(`canvas${i}`, i);
    }
}

function generateThree(canvasId, canvasNumber) {
    const canvas = document.getElementById(canvasId);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbccbe3);
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
        if(window.fpsTrackerActive) {
            const fpsEvent = new CustomEvent('logFPS', { detail: `Canvas ${canvasNumber} - Current FPS: ${getFPS()}` });
            window.dispatchEvent(fpsEvent);
        }
    }

    animate();
}

window.onload = function () {
    generateCanvases();
};
