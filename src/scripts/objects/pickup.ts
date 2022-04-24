export class Pickup extends Phaser.Physics.Arcade.Sprite {
  public name: string
  
  constructor(key: string, scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, key)
    scene.add.existing(this)
		scene.physics.add.existing(this)
		scene.physics.world.enable(this)

    const config = PickupList.find(entry => entry.key == key) as PickupConfig

    this.name = config.name
  }
}

export class PickupPool extends Phaser.GameObjects.Group {
	constructor(scene: Phaser.Scene, config: Phaser.Types.GameObjects.Group.GroupConfig = {}) {
		const defaults: Phaser.Types.GameObjects.Group.GroupConfig = {
			classType: Pickup,
			maxSize: -1,
		}

		super(scene, Object.assign(defaults, config))
	}

	spawn(key:string, x:number = 0, y:number = 0) {
		const spawnExisting = this.countActive(false) > 0

		// Scuffed logic, ideally I'd want to overwrite the way Phaser creates Objects
    const pickup = new Pickup(key, this.scene, x, y)
    pickup.setScale(2)
    this.add(pickup)

    if (!pickup) {
      return
    }

    if (spawnExisting) {
      pickup.setActive(true)
      pickup.setVisible(true)
    }

    return pickup
	}

	despawn(pickup: Pickup) {
		pickup.setActive(false)
		pickup.setVisible(false)
		pickup.removeInteractive()
		pickup.destroy()
	}

}

// List of all pickups

export interface PickupConfig {
  key: string,
  name: string,
}

export const PickupList: Array<PickupConfig> = [
  {
    key: 'pickup_coin',
    name: 'Coin',
  }
]