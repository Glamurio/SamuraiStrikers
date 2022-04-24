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
  private effect?: Effect
  private damage: number = 0
  private cooldown: number = 0
  
  // Create new instances of the same class as static attributes

  constructor(key: string, owner: Unit, scene?: Phaser.Scene) {
    super(key, owner)
    
    const config = WeaponList.find(entry => entry.key == key) as WeaponConfig

    this.name = key
    this.owner = owner
    this.damage = config.damage
    this.cooldown = config.cooldown

    this.effect = new Effect(scene!, config.spriteSheet, config.animation, this, false)
  }

  getDamage() {
    return this.damage
  }
  getCooldown() {
    return this.cooldown
  }
  getEffect() {
    return this.effect
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
    key: string,
    name: string,
    animation: string,
    spriteSheet: string,
    damage: number,
    cooldown: number,
    tags: Array<string>
}

export const WeaponList: Array<WeaponConfig> = [
  {
    key: 'weapon_katana',
    name: 'Katana',
    animation: 'katana_attack',
    spriteSheet: 'effects_slash',
    damage: 2,
    cooldown: 1000,
    tags: ['melee', 'slash']
  },
  {
    key: 'weapon_club',
    name: 'Club',
    animation: 'club_attack',
    spriteSheet: 'effects_slam',
    damage: 4,
    cooldown: 2000,
    tags: ['melee', 'blunt']
  },
]