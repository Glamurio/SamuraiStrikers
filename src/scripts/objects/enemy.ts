import { Unit, UnitOptions } from './unit'

export class Enemy extends Unit {
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, config: UnitOptions) {
		super(scene, x, y, texture, config)
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

	spawn( x:number = 0, y:number = 0, texture: string, config: UnitOptions ) {
		const spawnExisting = this.countActive(false) > 0

		// Scuffed logic, ideally I'd want to overwrite the way Phaser creates Objects
		if (this.getLength() < this.maxSize) {
			const enemy = new Enemy(this.scene, x, y, texture, config)
			this.add(enemy, true)
			// const enemy: Enemy = super.get(x, y, texture)

			if (!enemy) {
				return
			}
	
			if (spawnExisting) {
				enemy.setActive(true)
				enemy.setVisible(true)
			}
	
			return enemy

		}
	}

	despawn(enemy: Enemy) {
		enemy.setActive(false)
		enemy.setVisible(false)
		enemy.removeInteractive()
		enemy.destroy()
	}

}