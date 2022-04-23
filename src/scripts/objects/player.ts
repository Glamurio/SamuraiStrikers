import { Unit, UnitOptions } from './unit'

export default class Player extends Unit  {
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, config: UnitOptions) {
		super(scene, x, y, texture, config)

		this.setDamage(config.damage!)
		this.setHealth(config.health!)
    this.setTarget(config.target!)
	}

  update() {}
}