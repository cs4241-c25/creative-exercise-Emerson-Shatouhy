import * as THREE from 'three';

let cubes = [];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

camera.position.x = 0;
camera.position.z = 0;
camera.position.y = 0;

const pointLight = new THREE.PointLight(0xffffff, 100, 1000, 2);
pointLight.position.set(0, 0, 0);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
scene.add(pointLight);



let time = 0;
let direction = 1;

function makeNewCube() {
    if (cubes.length > 50) {
        return;
    }
    const randomSize = Math.random() * 2;
    const randomColor = Math.random() * 0xffffff;
    const randomX = Math.random() * 14 - 7;
    const randomY = Math.random() * 14 - 7;
    const randomZ = Math.random() * 14 - 7;
    const geometry = new THREE.BoxGeometry(randomSize, randomSize, randomSize);
    const material = new THREE.MeshPhongMaterial({ color: randomColor });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = randomX;
    cube.position.y = randomY;
    cube.position.z = randomZ;
    cube.castShadow = true;
    cube.receiveShadow = true;

    scene.add(cube);
    cubes.push([
        cube, {
            direction: 1,
            speed: Math.random() * 0.1,
            lifeSpan: 100
        }
    ]);
    return cube;
}

function makeSphere() {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: Math.random() * 0xffffff,
        emissive: Math.random() * 0xffffff,
        emissiveIntensity: 0.5
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;

    scene.add(sphere);
    return sphere;
}

makeNewCube();
makeNewCube();
makeNewCube();
makeNewCube();
makeNewCube();
makeNewCube();
makeNewCube();
makeNewCube();

makeSphere();

function moveCamera() {
    camera.position.x = Math.sin(time) * 5;
    camera.position.z = Math.cos(time) * 5;
    camera.position.y = Math.cos(time) * 5;
    camera.lookAt(0, 0, 0);
}


function animate() {
    moveCamera();

    for (let i = 0; i < cubes.length; i++) {
        const cube = cubes[i][0];
        const cubeData = cubes[i][1];
        cube.position.y += cubeData.speed * cubeData.direction;
        cube.position.x += cubeData.speed * cubeData.direction
        cube.rotation.x += 0.01 * cubeData.direction;
        cube.rotation.y += 0.01 * cubeData.direction;
        if (cube.position.y > 7 || cube.position.y < -7) {
            cubeData.direction *= -1;
            makeNewCube();

        }
        cubeData.lifeSpan--;
        if (cubeData.lifeSpan < 0) {
            scene.remove(cube);
            cubes.splice(i, 1);
            makeNewCube();

        }
    }

    time += 0.01;

    renderer.render(scene, camera);
}