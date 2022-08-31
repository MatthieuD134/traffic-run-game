import * as THREE from 'three';
import { arcCenterX, trackRadius } from './RenderMap';

const botAngleInitial = 0;
export let botAngleMoved = 0;
const speed = 0.002;

export function moveBotVehicle(botVehicle: THREE.Group, timeDelta: number) {
	const botSpeed = getBotSpeed();
	botAngleMoved -= botSpeed * timeDelta;

	const totalBotAngle = botAngleInitial + botAngleMoved;

	const botX = Math.cos(totalBotAngle) * trackRadius + arcCenterX;
	const botY = Math.sin(totalBotAngle) * trackRadius;

	botVehicle.position.x = botX;
	botVehicle.position.y = botY;

	botVehicle.rotation.z = totalBotAngle - Math.PI / 2;
}

function getBotSpeed() {
	return speed;
}

export function resetBotAngle() {
	botAngleMoved = 0;
}

export function getBotAngleMoved() {
	return botAngleMoved;
}

export function getBotAngle() {
	return botAngleInitial + botAngleMoved;
}
