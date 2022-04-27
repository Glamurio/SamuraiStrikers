import { clamp } from '../utilities'
import Effect from './effect'
import { Item } from './item'
import { Unit } from './unit'

export interface WeaponOptions {
  damage?: number,
  cooldown?: number,
}

export class Weapon extends Item {
  public targets: Array<Unit> = []
  public name: string
  private id: string
  private effect?: Effect
  private damage: number = 0
  private cooldown: number = 0
  private projectileSpeed: number = 0
  private description: string
  private attackMethod?: string
  
  // Create new instances of the same class as static attributes

  constructor(id: string, owner?: Unit, scene?: Phaser.Scene) {
    super(id, owner)
    
    const config = weaponList.find(entry => entry.id == id) as WeaponConfig

    this.id = id
    this.name = config.name
    this.owner = owner
    this.damage = config.damage
    this.cooldown = config.cooldown
    this.projectileSpeed = config.projectileSpeed || 0
    this.cost = config.cost
    this.description = config.description
    this.attackMethod = config.attackMethod

    this.effect = new Effect(scene!, config.spriteSheet, config.animation, this, false)
    // this.effect.anims.create({
    //   key: config.animation,
    //   frames: this.effect.anims.generateFrameNumbers(config.spriteSheet, { start: 0, end: 0 }),
    //   frameRate: 10,
    //   hideOnComplete: true
    // });
  }

  getID() {
    return this.id
  }
  getDescription() {
    return this.description
  }
  getDamage() {
    return this.damage
  }
  getCooldown() {
    return this.cooldown
  }
  getProjectileSpeed() {
    return this.projectileSpeed * 100
  }
  getEffect() {
    return this.effect
  }
  getAttackMethod() {
    return this.attackMethod
  }

  getTargets() {
    return this.targets
  }
  addTarget(target: Unit) {
    this.targets.push(target)
  }
  clearTargets() {
    this.targets = []
  }
  
  update() {}
}

// List of all weapons

export interface WeaponConfig {
    id: string,
    name: string,
    description: string,
    icon?: string
    animation: string,
    spriteSheet: string,
    damage: number,
    cooldown: number,
    projectileSpeed?: number,
    cost: number,
    attackMethod?: string,
    tags: Array<string>
}

export const weaponList: Array<WeaponConfig> = [
  {
    id: 'weapon_katana',
    name: 'Katana',
    description: 'Slashy slashy',
    icon: 'icon_katana',
    animation: 'attack_katana',
    spriteSheet: 'effects_slash',
    damage: 2,
    cooldown: 2000,
    cost: 100,
    attackMethod: 'circle',
    tags: ['melee', 'slash']
  },
  {
    id: 'weapon_kanabo',
    name: 'Kanabō',
    description: 'Carry a big stick',
    icon: 'icon_kanabo',
    animation: 'attack_kanabo',
    spriteSheet: 'effects_slam',
    damage: 6,
    cooldown: 6000,
    cost: 100,
    tags: ['melee', 'blunt']
  },
  {
    id: 'weapon_shuriken',
    name: 'Shuriken',
    description: 'Ore ha Ninja',
    icon: 'icon_shuriken',
    animation: 'attack_shuriken',
    spriteSheet: 'effects_shuriken',
    damage: 1,
    cooldown: 1000,
    projectileSpeed: 3,
    cost: 100,
    tags: ['ranged', 'slash']
  },
  {
    id: 'weapon_yumi',
    name: 'Yumi',
    description: 'Shoot first, ask later',
    icon: 'icon_yumi',
    animation: 'attack_yumi',
    spriteSheet: 'effects_arrow',
    damage: 2,
    cooldown: 4000,
    projectileSpeed: 4,
    cost: 100,
    attackMethod: 'projectile',
    tags: ['melee', 'pierce']
  },
  {
    id: 'weapon_naginata',
    name: 'Naginata',
    description: 'Cool',
    icon: 'icon_naginata',
    animation: 'attack_naginata',
    spriteSheet: 'effects_circle',
    damage: 4,
    cooldown: 6000,
    projectileSpeed: 2,
    cost: 100,
    tags: ['melee', 'slash']
  },
]