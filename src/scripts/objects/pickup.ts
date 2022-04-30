export class Pickup extends Phaser.Physics.Arcade.Sprite {
  public name: string
  
  constructor(id: string, scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, id)
    scene.add.existing(this)
		scene.physics.add.existing(this)
		scene.physics.world.enable(this)

    const config = pickupList.find(entry => entry.id == id) as PickupConfig

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

	spawn(id: string, x: number = 0, y: number = 0) {
		const spawnExisting = this.countActive(false) > 0

		// Scuffed logic, ideally I'd want to overwrite the way Phaser creates Objects
    const pickup = new Pickup(id, this.scene, x, y)
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
  id: string,
  name: string,
}

export const pickupList: Array<PickupConfig> = [
  {
    id: 'pickup_coin',
    name: 'Coin',
  }
]