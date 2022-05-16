import { clamp } from '../utilities'
import { Unit, UnitConfig } from './unit'

export class Player extends Unit  {
	private money: number = 0
	constructor(id: string, scene: Phaser.Scene, x: number, y: number) {

		const config = characterList.find(entry => entry.id == id) as UnitConfig
		super(id, scene, x, y, config)

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

// List of all characters

export const characterList: Array<UnitConfig> = [
	{
		id: 'character_orenji',
		name: 'Orenji',
		description: 'Samurai',
    damageModifier: 0,
    critChance: 0,
    maxHealth: 2,
    regen: 1,
    startingItem: 'weapon_katana',
    moveSpeed: 1.5,
    attackSpeed: 1,
    sizeModifier: 1,
    strength: 0,
    dexterity: 0,
    constitution: 0,
    skill: 0,
    resistance: 0,
	}
]