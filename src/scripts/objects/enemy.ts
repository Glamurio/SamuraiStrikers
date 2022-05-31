import { Unit, UnitConfig } from './unit'

export class Enemy extends Unit {
	constructor(scene: Phaser.Scene, x: number, y: number, id: string, target?: Unit) {

		const config = enemyList.find(entry => entry.id == id) as UnitConfig
		super(scene, x, y, id, config)

		this.setTarget(target!)	
	}

  update() {}
}

export class EnemyPool extends Phaser.GameObjects.Group {
	constructor(scene: Phaser.Scene, config: Phaser.Types.GameObjects.Group.GroupConfig = {}) {
		const defaults: Phaser.Types.GameObjects.Group.GroupConfig = {
			classType: Enemy,
			maxSize: 50,
		}

		super(scene, Object.assign(defaults, config))
	}

	spawn(id:string, target?: Unit, x:number = 0, y:number = 0) {
		const enemy: Enemy = this.get(x, y, id)

		if (!enemy) {
			return
		}

		enemy.setTarget(target!)

		enemy.setActive(true)
		enemy.setVisible(true)
		enemy.setInteractive()
		enemy.body.enable = true

		return enemy

	}

	despawn(enemy: Enemy) {
		enemy.setActive(false)
		enemy.setVisible(false)
		enemy.removeInteractive()
		enemy.body.enable = false
	}

}

// List of all characters

export const enemyList: Array<UnitConfig> = [
	{
		id: 'enemy_soldier',
		name: 'Soldier',
		description: 'Soldier',
    damageModifier: 0,
    critChance: 0,
    maxHealth: 2,
    regen: 0,
    moveSpeed: 1,
    attackSpeed: 1,
    sizeModifier: 1,
    strength: 0,
    dexterity: 0,
    constitution: 0,
    skill: 0,
    resistance: 0,
	}
]