import * as THREE from 'three';
import {
	getBotAngle,
	moveBotVehicle,
	resetBotAngle,
} from './helpers/BotVehicle';
import Car, { BOT_CAR_COLORS } from './helpers/Car';
import { Vehicle, VEHICLE_TYPES } from './helpers/constants';
import {
	getPlayerAngle,
	getPlayerAngleMoved,
	movePlayerCar,
	resetPlayerAngle,
} from './helpers/PlayerCar';
import renderMap from './helpers/RenderMap';

let camera: THREE.OrthographicCamera,
	scene: THREE.Scene,
	renderer: THREE.WebGLRenderer;

export const cameraWidth = 600;

// Set The different games variables
let ready: boolean;
let score: number;
const scoreSpanElement = document.getElementById('score') as HTMLSpanElement;
let lastTimestamp: number | undefined;
let playerCar: THREE.Group;
let botVehicles: Vehicle[] = [];

export let accelerate = false;
export let decelerate = false;

init();
animate();

function init() {
	const screenWidth = window.innerWidth;
	const screenHeight = window.innerHeight;

	scene = new THREE.Scene();

	playerCar = Car(0xa52523);
	scene.add(playerCar);

	renderMap(scene, screenWidth, screenHeight);

	// set up lights
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xfff1bc, 1);
	directionalLight.position.set(100, -300, 300);
	directionalLight.castShadow = true;
	directionalLight.target.position.set(0, 0, 0);
	directionalLight.shadow.bias = 0.0001;

	scene.add(directionalLight);

	// set up the camera
	const aspectRatio = screenWidth / screenHeight;
	const cameraHeight = cameraWidth / aspectRatio;

	camera = new THREE.OrthographicCamera(
		cameraWidth / -1, // left
		cameraWidth / 1, // right
		cameraHeight / 1, // top
		cameraHeight / -1, // bottom
		0, // near plane
		1000 // far plane
	);

	camera.position.set(0, -200, 300);
	camera.up.set(0, 0, 1);
	camera.lookAt(0, 0, 0);

	directionalLight.shadow.camera = new THREE.OrthographicCamera(
		cameraWidth / -1, // left
		cameraWidth / 1, // right
		cameraHeight / 1, // top
		cameraHeight / -1, // bottom
		0, // near plane
		1000 // far plane
	);

	// set up the renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		// canvas: document.getElementById('app') as HTMLCanvasElement,
	});
	renderer.setSize(screenWidth, screenHeight);
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.shadowMap.enabled = true;

	document.body.appendChild(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);

	reset();
}

// Handle Screen resizing
function onWindowResize() {
	const aspect = window.innerWidth / window.innerHeight;

	camera.left = cameraWidth / -1;
	camera.right = cameraWidth / 1;
	camera.top = cameraWidth / aspect / 1;
	camera.bottom = cameraWidth / aspect / -1;

	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

function reset() {
	// reset the position and score
	resetPlayerAngle();
	movePlayerCar(playerCar, 0, accelerate, decelerate);
	score = 0;
	scoreSpanElement.innerText = '0';
	lastTimestamp = undefined;

	// Remove other vehicles
	botVehicles.forEach((vehicle) => scene.remove(vehicle.vehicle));
	botVehicles = [];

	const botVehicle = Car(
		BOT_CAR_COLORS[Math.floor(Math.random() * BOT_CAR_COLORS.length)] // get random color for the bot car
	);
	scene.add(botVehicle); // add bot vehicle to the scene
	resetBotAngle();
	botVehicles.push({ type: 'car', vehicle: botVehicle });

	moveBotVehicle(botVehicle, 0);

	renderer.render(scene, camera);
	ready = true;
}

function startGame() {
	if (ready) {
		ready = false;
		renderer.setAnimationLoop(animation);
	}
}

function animation(timestamp: number) {
	if (!lastTimestamp) {
		lastTimestamp = timestamp;
		return;
	}

	const timeDelta = timestamp - lastTimestamp;

	movePlayerCar(playerCar, timeDelta, accelerate, decelerate);

	botVehicles.forEach((vehicle) => moveBotVehicle(vehicle.vehicle, timeDelta));

	const laps = Math.floor(Math.abs(getPlayerAngleMoved()) / (Math.PI * 2));

	//Update score if is changed
	if (laps != score) {
		score = laps;
		scoreSpanElement.innerText = laps.toString();
		console.log(laps);
	}

	hitDetection();

	renderer.render(scene, camera);
	lastTimestamp = timestamp;
}

function getHitZonPosition(
	center: THREE.Vector3,
	angle: number,
	distance: number
) {
	const directionAngle = angle + Math.PI / 2;
	return {
		x: center.x - Math.cos(directionAngle) * distance,
		y: center.y + Math.sin(directionAngle) * distance,
	};
}

function hitDetection() {
	// Front of vehicle
	const playerHitZone1 = getHitZonPosition(
		playerCar.position,
		getPlayerAngle(),
		-15
	);

	// Back of vehicle
	const playerHitZone2 = getHitZonPosition(
		playerCar.position,
		getPlayerAngle(),
		15
	);

	const hit = botVehicles.some((vehicle) => {
		if (vehicle.type === VEHICLE_TYPES.CAR) {
			// Front of Vehicle
			const vehicleHitZone1 = getHitZonPosition(
				vehicle.vehicle.position,
				getBotAngle(),
				15
			);

			// Back of Vehicle
			const vehicleHitZone2 = getHitZonPosition(
				vehicle.vehicle.position,
				getBotAngle(),
				-15
			);

			// The player hits another vehicle
			if (getDistance(playerHitZone1, vehicleHitZone1) < 40) return true;
			if (getDistance(playerHitZone1, vehicleHitZone2) < 40) return true;

			if (getDistance(playerHitZone2, vehicleHitZone1) < 40) return true;
			if (getDistance(playerHitZone2, vehicleHitZone2) < 40) return true;
		}
	});

	if (hit) renderer.setAnimationLoop(null);
}

function getDistance(
	point1: { x: number; y: number },
	point2: { x: number; y: number }
) {
	return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}

window.addEventListener('keydown', function (event) {
	// Type enter to start the game
	if (event.key === 'Enter') {
		startGame();
		return;
	}

	if (event.key === 'ArrowUp' && !decelerate) {
		accelerate = true;
		return;
	}

	if (event.key === 'ArrowDown' && !accelerate) {
		decelerate = true;
		return;
	}
	if (event.key === 'R' || event.key === 'r') {
		reset();
		return;
	}
});

window.addEventListener('keyup', function (event) {
	if (event.key === 'ArrowUp') {
		accelerate = false;
		return;
	}

	if (event.key === 'ArrowDown') {
		decelerate = false;
		return;
	}
});
