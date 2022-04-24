import { Weapon } from "./weapon"

export default class Effect extends Phaser.Physics.Arcade.Sprite {
  public owner: Weapon
  private animation: string
  
  constructor(scene: Phaser.Scene, spriteSheet: string, animation: string, owner: Weapon, visible: boolean = false) {
    super(scene, 0, 0, spriteSheet)
    scene.add.existing(this)
		scene.physics.add.existing(this)
		scene.physics.world.enable(this);

    this.setVisible(visible)
    this.animation = animation
    this.owner = owner
  }

  getAnimation() {
    return this.animation
  }

  update() {}
}