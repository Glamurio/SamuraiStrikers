export default class Unit extends Phaser.Physics.Arcade.Sprite {
  public target?: Phaser.GameObjects.Components.Transform
  
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: number) {
    super(scene, x, y, texture, frame!)
    scene.add.existing(this)
		scene.physics.add.existing(this)
		scene.physics.world.enable(this);
  }

  setTarget(target: Phaser.GameObjects.Components.Transform){
		this.target = target
	}

  update() {}
}