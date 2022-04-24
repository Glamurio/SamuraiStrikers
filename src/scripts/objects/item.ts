import { Unit } from './unit'

export class Item {
  public name: string
  public owner: Unit
  public icon?: Phaser.Physics.Arcade.Image
  
  constructor(name: string, owner: Unit) {
    
    this.name = name
    this.owner = owner
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