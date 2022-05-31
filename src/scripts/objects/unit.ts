import { clamp, isWeapon } from '../utilities'
import { Item } from './item'
import { Weapon } from './weapon'

export class Unit extends Phaser.Physics.Arcade.Sprite {
  private items: Array<Item> = []
  private config: UnitConfig
  private target: Phaser.GameObjects.Components.Transform
  private strength: number
  private dexterity: number
  private constitution: number
  private skill: number
  private maxHealth: number
  private health: number
  private regen: number
  private sizeModifier: number
  private attackSpeed: number
  private moveSpeed: number
  private critChance: number
  private damageModifier: number
  private resistance: number
  private charging: boolean = false
  private charge: number = 0
  private fullCharge: boolean = false
  
  constructor(scene: Phaser.Scene, x: number, y: number, id: string, config: UnitConfig ) {
    super(scene, x, y, id)
    scene.add.existing(this)
		scene.physics.add.existing(this)
		scene.physics.world.enable(this)

    this.config = config
    
    this.maxHealth = config.maxHealth || 100
    this.health = config.maxHealth || 1
    this.regen = config.regen || 1
    this.attackSpeed = config.attackSpeed || 1
    this.moveSpeed = config.moveSpeed || 2
    this.sizeModifier = config.sizeModifier || 1
    this.critChance = config.critChance || 0
    this.resistance = config.resistance || 0
    this.damageModifier = config.damageModifier || 0
    this.strength = config.strength || 0
    this.dexterity = config.dexterity || 0
    this.constitution = config.constitution || 0
    this.skill = config.skill || 0

    const item = new Item(config.startingItem!, this)
    if (item) {
      this.items.push(item)
    }
  }

  // Misc
  setCharging(value: boolean) {
    this.charging = value
  }
  isCharging() {
    return this.charging
  }
  increaseCharge() {
    this.charge++
  }
  resetCharge() {
    this.charge = 0
  }
  getCharge() {
    return this.charge
  }
  setFullCharge(value: boolean) {
    this.fullCharge = value
  }
  getFullCharge() {
    return this.fullCharge
  }


  // Stats
  getHealth() {
    return this.health
  }
  getRegen() {
    return this.regen
  }
  getAttackSpeed() {
    return this.attackSpeed
  }
  getMoveSpeed() {
    return this.moveSpeed * 100
  }
  getSizeModifier() {
    return this.sizeModifier
  }
  getDamageModifier() {
    return this.damageModifier
  }
  getResistance() {
    return this.resistance
  }
  getCritChance() {
    return this.critChance
  }

  // Damage
  damageUnit(value: number) {
    this.health = clamp(this.health) - clamp(value)
  }
  healUnit(value: number) {
    this.health = clamp(this.health) + clamp(value, 0, this.maxHealth)
  }

  updateValues() {
    this.maxHealth = (this.config.maxHealth || 1) * (1 + this.constitution * 0.05)
    this.regen = (this.config.regen || 1) * (1 + this.constitution * 0.1)
    this.attackSpeed = (this.config.attackSpeed || 1) * (1 + this.dexterity * 0.05)
    this.moveSpeed = (this.config.moveSpeed || 1) * (1 + this.dexterity * 0.05)
    this.sizeModifier = (this.config.sizeModifier || 1) * (1 + this.skill * 0.05)
    this.critChance = (this.config.critChance || 0) + (this.skill * 0.05)
    this.resistance = (this.config.resistance || 0) + (this.strength * 0.02)
    this.damageModifier = (this.config.damageModifier || 0) + (1 + this.strength * 0.05)
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

  update() {}
}

export interface UnitConfig {
  id: string,
  name: string,
  description: string,
  damageModifier: number,
  maxHealth: number,
  regen: number,
  startingItem?: string,
  moveSpeed: number,
  attackSpeed: number,
  sizeModifier: number,
  strength: number,
  dexterity: number,
  constitution: number,
  skill: number,
  critChance: number
  resistance: number,
}