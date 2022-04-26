import { Unit } from './unit'

export class Item {
  public name: string
  public owner?: Unit
  public icon?: Phaser.Physics.Arcade.Image
  public cost: number = 0
  
  constructor(name: string, owner?: Unit) {
    
    this.name = name
    this.owner = owner
  }

  getCost() {
    return this.cost
  }

  getOwner() {
    return this.owner
  }
  setOwner(unit: Unit) {
    this.owner = unit
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