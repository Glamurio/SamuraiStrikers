import { clamp, isWeapon } from '../utilities'
import { Item } from './item'
import { Weapon } from './weapon'

export interface UnitOptions {
  damage?:number,
  health?:number,
  items?: Array<Item>,
  moveSpeed?: number,
  attackSpeed?: number,
  target?: Phaser.GameObjects.Components.Transform
}

export class Unit extends Phaser.Physics.Arcade.Sprite {
  private items: Array<Item>
  private target: Phaser.GameObjects.Components.Transform
  private damage:number
  private health:number
  private attackSpeed: number
  private moveSpeed: number
  
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, config: UnitOptions ) {
      
    super(scene, x, y, texture)
    scene.add.existing(this)
		scene.physics.add.existing(this)
		scene.physics.world.enable(this)
    
    this.damage = config.damage! || 1
    this.health = config.health! || 1
    this.attackSpeed = config.attackSpeed! || 1
    this.moveSpeed = config.moveSpeed! || 2
    this.items = config.items! || []
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

  getAttackSpeed() {
    return this.attackSpeed
  }
  setAttackSpeed(value: number) {
    this.attackSpeed = clamp(value, 0.01, 1)
  }

  getMoveSpeed() {
    return this.moveSpeed * 100
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

  // Items
  addItem(item: Item) {
    this.items.push(item)
  }
  getItems() {
    return this.items
  }
  getWeapons() {
    return this.items.filter(item => isWeapon(item)) as Array<Weapon>
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