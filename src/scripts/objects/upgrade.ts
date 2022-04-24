import { Item } from "./item"
import { Unit } from "./unit"

export class Upgrade {
  public name: string
  public owner: Item | Unit
  public icon?: Phaser.Physics.Arcade.Image
  private damage: number
  private tags: Array<string>
  
  constructor(key: string, owner: Item | Unit, icon?: Phaser.Physics.Arcade.Image) {

    const config = UpgradeList.find(entry => entry.key == key) as UpgradeConfig
    
    this.name = config.name
    this.owner = owner
    this.icon = icon
    this.damage = config.damage
    this.tags = config.tags
  }
}

// List of all upgrades

export interface UpgradeConfig {
  key: string,
  name: string,
  icon?: Phaser.Physics.Arcade.Image
  damage: number,
  tags: Array<string>
}

export const UpgradeList: Array<UpgradeConfig> = [
  {
    key: 'upgrade_damage',
    name: 'Damage',
    icon: undefined,
    damage: 2,
    tags: ['melee']
  }
]