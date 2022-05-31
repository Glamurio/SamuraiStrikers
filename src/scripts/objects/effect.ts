import { Weapon } from "./weapon"

export class Effect extends Phaser.Physics.Arcade.Sprite {
  public owner: Weapon
  public animation: string
  public spriteSheet: string
  public baseVelocity: Phaser.Math.Vector2
  public random: number
  
  constructor(scene: Phaser.Scene, spriteSheet: string, animation: string, owner: Weapon, visible: boolean = false) {
    super(scene, 0, 0, spriteSheet)
    scene.add.existing(this)
		scene.physics.add.existing(this)
		scene.physics.world.enable(this);

    this.setVisible(visible)
    this.animation = animation
    this.owner = owner
    this.spriteSheet = spriteSheet
  }

  setRandom(value: number) {
    this.random = value
  }
  getRandom() {
    return this.random
  }
  setBaseVelocity(x: number, y: number) {
    this.baseVelocity = new Phaser.Math.Vector2(x, y)
  }
  getBaseVelocity() {
    return this.baseVelocity
  }
  getAnimation() {
    return this.animation
  }

  update() {}
}

export class EffectPool extends Phaser.GameObjects.Group {
  public hasEvent: boolean = false
  public spriteSheet: string
  public animation: string
	constructor(scene: Phaser.Scene, spriteSheet: string, animation: string, config: Phaser.Types.GameObjects.Group.GroupConfig = {}) {
		const defaults: Phaser.Types.GameObjects.Group.GroupConfig = {
			classType: Effect,
			maxSize: -1,
		}
		super(scene, Object.assign(defaults, config))
    
    this.spriteSheet = spriteSheet
    this.animation = animation
	}

	spawn(spriteSheet: string, animation: string, owner: Weapon) {
		const spawnExisting = this.countActive(false) > 0

    const effect = this.get(0, 0, spriteSheet)
    effect.animation = animation
    effect.owner = owner

    if (!effect) {
      return
    }

    effect.setActive(true)
    effect.setVisible(true)

    return effect
	}

	despawn(effect: Effect) {
		effect.setActive(false)
		effect.setVisible(false)
	}
}