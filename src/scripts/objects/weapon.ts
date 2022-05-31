import { Effect, EffectPool } from './effect'
import { Item } from './item'
import { Unit } from './unit'

export class Weapon extends Item {
  public targets: Array<Unit> = []
  public name: string
  private id: string
  private sound: string
  private effect: EffectPool
  private activeEffects: Array<Effect> = []
  private damage: number = 0
  private cooldown: number = 0
  private ready: boolean = true
  private projectiles: number
  private projectileSpeed: number = 0
  private rotationSpeed: number = 0
  private stability: number
  private description: string
  private angle: number
  private hasAlternated: boolean
  private attackMethod?: string
  private tags: Array<string>
  
  // Create new instances of the same class as static attributes

  constructor(id: string, scene: Phaser.Scene, owner?: Unit) {
    super(id, owner)
    
    const config = weaponList.find(entry => entry.id == id) as WeaponConfig

    this.id = id
    this.name = config.name
    this.owner = owner
    this.damage = config.damage
    this.cooldown = config.cooldown
    this.projectiles = config.projectiles || 1
    this.projectileSpeed = config.projectileSpeed || 0
    this.rotationSpeed = config.rotationSpeed || 0
    this.stability = config.stability || 0
    this.cost = config.cost
    this.angle = config.angle || 0
    this.description = config.description
    this.attackMethod = config.attackMethod
    this.sound = config.sound || ''
    this.tags = config.tags

    this.effect = scene.add.existing(new EffectPool(scene, config.spriteSheet, config.animation))
    // this.effect.anims.create({
    //   key: config.animation,
    //   frames: this.effect.anims.generateFrameNumbers(config.spriteSheet, { start: 0, end: 0 }),
    //   frameRate: 10,
    //   hideOnComplete: true
    // });
  }

  // General
  getID() {
    return this.id
  }
  getDescription() {
    return this.description
  }
  getSound() {
    return this.sound
  }
  getTags() {
    return this.tags
  }
  isReady() {
    return this.ready
  }
  setReady(value: boolean) {
    this.ready = value
  }

  // Stats
  getDamage() {
    return this.damage
  }
  getCooldown() {
    return this.cooldown
  }
  getProjectiles() {
    return this.projectiles
  }
  getProjectileSpeed() {
    return this.projectileSpeed * 100
  }
  getRotation() {
    return this.rotationSpeed / 60
  }
  getStability() {
    return this.stability
  }
  getAttackMethod() {
    return this.attackMethod
  }

  
  // Effects
  getEffect() {
    return this.effect
  }
  addActiveEffect(effect: Effect) {
    return this.activeEffects.push(effect)
  }
  removeActiveEffect(effect: Effect, index?: number) {
    if(index) {
      this.activeEffects = this.activeEffects.splice(index, 1);
    } else {
      this.activeEffects = this.activeEffects.filter(item => item !== effect)
    }
    this.effect.despawn(effect)
  }
  getActiveEffects() {
    return this.activeEffects
  }

  // Miscellaneous
  getAngle() {
    return this.angle
  }
  getAlternation() {
    return this.hasAlternated
  }
  toggleAlternation() {
    this.hasAlternated = !this.hasAlternated;
  }

  // Targeting
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
    icon?: string,
    sound?: string,
    animation: string,
    spriteSheet: string,
    damage: number,
    cooldown: number,
    projectiles?: number,
    projectileSpeed?: number,
    rotationSpeed?: number,
    stability?: number,
    angle?: number,
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
    sound: 'sound_sword_1',
    animation: 'attack_katana',
    spriteSheet: 'effects_slash',
    damage: 4,
    cooldown: 1500,
    cost: 100,
    attackMethod: 'melee',
    projectiles: 2,
    projectileSpeed: 2,
    tags: ['speed', 'size']
  },
  {
    id: 'weapon_kanabo',
    name: 'Kanabō',
    description: 'Bonk',
    icon: 'icon_kanabo',
    animation: 'attack_kanabo',
    spriteSheet: 'effects_slam',
    damage: 6,
    cooldown: 500,
    cost: 100,
    attackMethod: 'melee',
    tags: ['size']
  },
  {
    id: 'weapon_shuriken',
    name: 'Shuriken',
    description: 'Ore ha Ninja',
    icon: 'icon_shuriken',
    animation: 'attack_shuriken',
    spriteSheet: 'effects_shuriken',
    damage: 2,
    cooldown: 500,
    projectileSpeed: 4,
    rotationSpeed: 10,
    angle: 180,
    stability: 1,
    cost: 100,
    attackMethod: 'ranged',
    tags: ['amount']
  },
  {
    id: 'weapon_yumi',
    name: 'Yumi',
    description: '',
    icon: 'icon_yumi',
    animation: 'attack_yumi',
    spriteSheet: 'effects_arrow',
    damage: 2,
    cooldown: 1500,
    projectileSpeed: 3,
    stability: 1,
    cost: 100,
    attackMethod: 'ranged',
    tags: ['pierce', 'speed']
  },
  {
    id: 'weapon_naginata',
    name: 'Naginata',
    description: '',
    icon: 'icon_naginata',
    animation: 'attack_naginata',
    spriteSheet: 'effects_circle_half',
    damage: 4,
    cooldown: 4000,
    angle: 180,
    cost: 100,
    attackMethod: 'melee',
    tags: ['area']
  },
  {
    id: 'weapon_tanto',
    name: 'Tanto',
    description: '',
    icon: 'icon_tanto',
    animation: 'attack_tanto',
    spriteSheet: 'effects_slash_small',
    damage: 3,
    cooldown: 200,
    projectileSpeed: 2,
    angle: -1,
    cost: 100,
    attackMethod: 'melee',
    tags: ['reach', 'amount']
  },
]