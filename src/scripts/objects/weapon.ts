import Effect from './effect'
import { Upgrade } from './upgrade'
import { Unit } from './unit'

export interface WeaponOptions {
  damage?: number,
  cooldown?: number,
}

export class Weapon extends Upgrade {
  public targets: Array<Unit> = []
  public name: string
  private effect?: Effect
  private damage: number = 0
  private cooldown: number = 0
  private attackSpeed: number = 0
  
  // Create new instances of the same class as static attributes

  constructor(key: string, owner: Unit, scene?: Phaser.Scene) {
    super(key, owner)
    
    const config = WeaponList.find(entry => entry.key == key) as WeaponConfig

    this.name = key
    this.owner = owner
    this.damage = config.damage
    this.cooldown = config.cooldown

    this.effect = new Effect(scene!, config.spritesheet, config.animation, this, false)
  }

  getDamage() {
    return this.damage
  }
  getCooldown() {
    return this.cooldown
  }
  getAttackSpeed() {
    return this.attackSpeed
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
    spritesheet: string,
    damage: number,
    cooldown: number,
}

export const WeaponList: Array<WeaponConfig> = [
  {
    key: 'weapon_katana',
    name: 'Katana',
    animation: 'katana_attack',
    spritesheet: 'effects_slash',
    damage: 1,
    cooldown: 0
  },
  {
    key: 'weapon_club',
    name: 'Club',
    animation: 'club_attack',
    spritesheet: 'effects_slam',
    damage: 1,
    cooldown: 0
  },
]