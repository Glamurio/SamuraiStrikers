import Unit from './unit'

export default class Player extends Unit {
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: number) {
		super(scene, x, y, texture, frame!)
	}

  update() {}
}