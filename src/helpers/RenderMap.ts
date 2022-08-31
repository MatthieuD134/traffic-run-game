import * as THREE from 'three';

// Define the constants to create the track
export const trackRadius = 600 / 3;
const trackWidth = 30;
const innerTrackRadius = trackRadius - trackWidth;
const outerTrackRadius = trackRadius + trackWidth;

const arcAngle1 = (1 / 3) * Math.PI; // 60 degrees,

const deltaY = Math.sin(arcAngle1) * innerTrackRadius;
const arcAngle2 = Math.sin(deltaY / outerTrackRadius);

export const arcCenterX =
	(Math.cos(arcAngle1) * innerTrackRadius +
		Math.cos(arcAngle2) * outerTrackRadius) /
	2;

const arcAngle3 = Math.acos(arcCenterX / innerTrackRadius);

const arcAngle4 = Math.acos(arcCenterX / outerTrackRadius);

// create the map
function renderMap(scene: THREE.Scene, mapWidth: number, mapHeight: number) {
	// Plane with line markings
	const lineMarkingstexture = getLineMarkings(mapWidth, mapHeight);

	const planeGeometry = new THREE.PlaneBufferGeometry(mapWidth, mapHeight);
	const planeMaterial = new THREE.MeshLambertMaterial({
		color: 0x546e90,
		map: lineMarkingstexture,
	});
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	scene.add(plane);

	// Extruded geometry
	const islandLeft = getLeftIsland();
	const islandRight = getRightIsland();
	const islandMiddle = getMiddleIsland();
	const outerField = getOuterField(mapWidth, mapHeight);

	const fieldGeometry = new THREE.ExtrudeBufferGeometry(
		[islandLeft, islandMiddle, islandRight, outerField],
		{
			depth: 6,
			bevelEnabled: false,
		}
	);

	const fieldMesh = new THREE.Mesh(fieldGeometry, [
		new THREE.MeshLambertMaterial({ color: 0x67c240 }),
		new THREE.MeshLambertMaterial({ color: 0x23311c }),
	]);

	scene.add(fieldMesh);
}

function getLineMarkings(mapWidth: number, mapHeight: number) {
	const canvas = document.createElement('canvas');
	canvas.width = mapWidth;
	canvas.height = mapHeight;
	const context = canvas.getContext('2d');

	if (context) {
		context.fillStyle = '#546e90';
		context.fillRect(0, 0, mapWidth, mapHeight);

		context.lineWidth = 2;
		context.strokeStyle = '#ffffff';
		context.setLineDash([10, 14]);

		// left circle
		context.beginPath();
		context.arc(
			mapWidth / 2 - arcCenterX,
			mapHeight / 2,
			trackRadius,
			0,
			Math.PI * 2
		);
		context.stroke();

		// right circle
		context.beginPath();
		context.arc(
			mapWidth / 2 + arcCenterX,
			mapHeight / 2,
			trackRadius,
			0,
			Math.PI * 2
		);
		context.stroke();
	}

	return new THREE.CanvasTexture(canvas);
}

function getLeftIsland() {
	const islandLeft = new THREE.Shape();

	islandLeft.absarc(
		-arcCenterX,
		0,
		innerTrackRadius,
		arcAngle1,
		-arcAngle1,
		false
	);

	islandLeft.absarc(
		arcCenterX,
		0,
		outerTrackRadius,
		Math.PI + arcAngle2,
		Math.PI - arcAngle2,
		true
	);

	return islandLeft;
}

function getRightIsland() {
	const islandRight = new THREE.Shape();

	islandRight.absarc(
		arcCenterX,
		0,
		innerTrackRadius,
		Math.PI - arcAngle1,
		-Math.PI + arcAngle1,
		true
	);

	islandRight.absarc(
		-arcCenterX,
		0,
		outerTrackRadius,
		-arcAngle2,
		arcAngle2,
		false
	);

	return islandRight;
}

function getMiddleIsland() {
	const islandMiddle = new THREE.Shape();

	islandMiddle.absarc(
		-arcCenterX,
		0,
		innerTrackRadius,
		arcAngle3,
		-arcAngle3,
		true
	);

	islandMiddle.absarc(
		arcCenterX,
		0,
		innerTrackRadius,
		-Math.PI + arcAngle3,
		Math.PI - arcAngle3,
		true
	);

	return islandMiddle;
}

function getOuterField(mapWidth: number, mapHeight: number) {
	const outerField = new THREE.Shape();

	outerField.moveTo(-mapWidth / 2, -mapHeight / 2);
	outerField.lineTo(0, -mapHeight / 2);

	outerField.absarc(
		-arcCenterX,
		0,
		outerTrackRadius,
		-arcAngle4,
		arcAngle4,
		true
	);

	outerField.absarc(
		arcCenterX,
		0,
		outerTrackRadius,
		Math.PI - arcAngle4,
		-Math.PI + arcAngle4,
		true
	);

	outerField.lineTo(0, -mapHeight / 2);
	outerField.lineTo(mapWidth / 2, -mapHeight / 2);
	outerField.lineTo(mapWidth / 2, mapHeight / 2);
	outerField.lineTo(-mapWidth / 2, mapHeight / 2);

	return outerField;
}

export default renderMap;
