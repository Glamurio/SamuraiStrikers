export default class Effect extends Phaser.Physics.Arcade.Sprite {
  
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: number) {
    super(scene, x, y, texture, frame!)
    scene.add.existing(this)
		scene.physics.add.existing(this)
		scene.physics.world.enable(this);
  }

  update() {}
}