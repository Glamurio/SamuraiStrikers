import { clamp } from '../utilities'
import { Unit, UnitOptions } from './unit'

export default class Player extends Unit  {
	private money: number = 0
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, config: UnitOptions) {
		super(scene, x, y, texture, config)

		this.setDamage(config.damage!)
		this.setHealth(config.health!)
    this.setTarget(config.target!)
	}

	subtractMoney(amount: number) {
		this.money -= clamp(amount)
	}
	addMoney(amount: number) {
		this.money += clamp(amount)
	}
	getMoney() {
		return clamp(this.money, 0, 999)
	}

  update() {}
}