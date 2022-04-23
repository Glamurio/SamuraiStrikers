import { clamp } from '../utilities'
import { Upgrade } from './upgrade'
import { Weapon } from './weapon'

export interface UnitOptions {
  damage?:number,
  health?:number,
  Upgrades?: Array<Upgrade>,
  moveSpeed?: number,
  target?: Phaser.GameObjects.Components.Transform
}

export class Unit extends Phaser.Physics.Arcade.Sprite {
  private upgrades: Array<Upgrade> = []
  private target: Phaser.GameObjects.Components.Transform
  private damage:number = 0
  public health:number = 0
  private moveSpeed: number = 0
  
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, config: UnitOptions ) {
      
    super(scene, x, y, texture)
    scene.add.existing(this)
		scene.physics.add.existing(this)
		scene.physics.world.enable(this)
    
    this.damage = config.damage!
    this.health = config.health!
    this.moveSpeed = config.moveSpeed!
    this.upgrades = config.Upgrades! || []
    this.target = config.target!
  }

  // Stats
  getDamage() {
    return this.damage
  }
  setDamage(value: number) {
    this.damage = clamp(value)
  }

  getHealth() {
    return this.health
  }
  setHealth(value: number) {
    this.health = clamp(value)
  }

  getMoveSpeed() {
    return this.moveSpeed
  }
  setMoveSpeed(value: number) {
    this.moveSpeed = clamp(value)
  }
 
  // Target
  setTarget(target: Phaser.GameObjects.Components.Transform) {
		this.target = target
	}
  getTarget() {
    return this.target
  }

  // Upgrades
  addUpgrade(Upgrade: Upgrade) {
    this.upgrades.push(Upgrade)
  }
  getUpgrades() {
    return this.upgrades
  }
  getWeapons() {
    const isWeapon = (tbd: any): tbd is Weapon => true
    return this.upgrades.filter(upgrade => isWeapon(upgrade)) as Array<Weapon>
  }

  // setAttribute(attribute: string, value: number | string) {
  //   if (this.attributes[attribute] != undefined) {
  //     this.attributes[attribute] = value as any instanceof Number ? clamp(value as number) : value
  //   } else {
  //     console.log(`'${attribute}' is not an attribute.`)
  //   }
  // }
  // getAttribute(attribute: string) {
  //   if (this.attributes[attribute] != undefined) {
  //     return this.attributes[attribute]
  //   } else {
  //     return console.log(`'${attribute}' is not an attribute.`)
  //   }
  // }

  update() {}
}