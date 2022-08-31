import * as THREE from 'three';
import { arcCenterX, trackRadius } from './RenderMap';

const playerAngleInitial = Math.PI;
export let playerAngleMoved = 0;
const speed = 0.0017;

export function movePlayerCar(
	playerCar: THREE.Group,
	timeDelta: number,
	accelerate: boolean,
	decelerate: boolean
) {
	const playerSpeed = getPlayerSpeed(accelerate, decelerate);
	playerAngleMoved -= playerSpeed * timeDelta;

	const totalPlayerAngle = playerAngleInitial + playerAngleMoved;

	const playerX = Math.cos(totalPlayerAngle) * trackRadius - arcCenterX;
	const playerY = Math.sin(totalPlayerAngle) * trackRadius;

	playerCar.position.x = playerX;
	playerCar.position.y = playerY;

	playerCar.rotation.z = totalPlayerAngle - Math.PI / 2;
}

function getPlayerSpeed(accelerate: boolean, decelerate: boolean) {
	if (accelerate) return speed * 2;
	if (decelerate) return speed * 0.5;
	return speed;
}

export function resetPlayerAngle() {
	playerAngleMoved = 0;
}

export function getPlayerAngleMoved() {
	return playerAngleMoved;
}

export function getPlayerAngle() {
	return playerAngleInitial + playerAngleMoved;
}
