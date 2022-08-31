import * as THREE from 'three';

export const BOT_CAR_COLORS = [0x2596be, 0xffc633, 0x048e3e];

function Car(color: THREE.ColorRepresentation) {
	const car = new THREE.Group();

	const backWheel = new THREE.Mesh(
		new THREE.BoxBufferGeometry(10, 30, 10),
		new THREE.MeshLambertMaterial({ color: 0x333333 })
	);
	backWheel.position.x = -15; // position the backwheel to the back of the car
	backWheel.position.z = 5; // lift the wheel of half it's depth, otherwize it's half into the ground
	car.add(backWheel);

	const frontWheel = new THREE.Mesh(
		new THREE.BoxBufferGeometry(10, 30, 10),
		new THREE.MeshLambertMaterial({ color: 0x333333 })
	);
	frontWheel.position.x = 15; // position the frontWheel to the back of the car
	frontWheel.position.z = 5; // lift the wheel of half it's depth, otherwize it's half into the ground
	car.add(frontWheel);

	const carBody = new THREE.Mesh(
		new THREE.BoxBufferGeometry(60, 28, 15),
		new THREE.MeshLambertMaterial({ color: color })
	);
	carBody.position.z = 7.5 + 5; // half the depth of the body + halfe the depth of the wheel to elevate it more
	carBody.position.x = 3; // add a bit more length to the front of the car
	car.add(carBody);

	const carFrontTexture = getCarFrontTexture();
	carFrontTexture.center = new THREE.Vector2(0.5, 0.5);
	carFrontTexture.rotation = Math.PI / 2;

	const carBackTexture = getCarFrontTexture();
	carBackTexture.center = new THREE.Vector2(0.5, 0.5);
	carBackTexture.rotation = -Math.PI / 2;

	const carRightTexture = getCarSideTexture();

	const carLeftTexture = getCarSideTexture();
	carLeftTexture.center = new THREE.Vector2(0.5, 0.5);
	carLeftTexture.flipY = false;

	const carCabin = new THREE.Mesh(new THREE.BoxBufferGeometry(35, 24, 12), [
		new THREE.MeshLambertMaterial({ map: carFrontTexture }),
		new THREE.MeshLambertMaterial({ map: carBackTexture }),
		new THREE.MeshLambertMaterial({ map: carLeftTexture }),
		new THREE.MeshLambertMaterial({ map: carRightTexture }),
		new THREE.MeshLambertMaterial({ color: 0xffffff }),
		new THREE.MeshLambertMaterial({ color: 0xffffff }),
	]);
	carCabin.position.z = 5 + 15 + 6; // combine the offset of the body, the depth of the body and half the depth of the cabin
	carCabin.position.x = -5; // get the cabin slightly toward the back of the car
	car.add(carCabin);

	// finally return the car Element
	return car;
}

function getCarFrontTexture() {
	const canvas = document.createElement('canvas');
	canvas.width = 64;
	canvas.height = 32;
	const context = canvas.getContext('2d');

	if (context) {
		context.fillStyle = '#ffffff';
		context.fillRect(0, 0, 64, 32);

		context.fillStyle = '#666666';
		context.fillRect(8, 8, 48, 24);
	}

	return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture() {
	const canvas = document.createElement('canvas');
	canvas.width = 128;
	canvas.height = 32;
	const context = canvas.getContext('2d');

	if (context) {
		context.fillStyle = '#ffffff';
		context.fillRect(0, 0, 128, 32);

		context.fillStyle = '#666666';
		context.fillRect(10, 8, 38, 24);
		context.fillRect(58, 8, 60, 24);
	}

	return new THREE.CanvasTexture(canvas);
}

export default Car;
