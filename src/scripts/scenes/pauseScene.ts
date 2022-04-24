export default class PauseScene extends Phaser.Scene {
  escapeKey: Phaser.Input.Keyboard.Key

  constructor() {
    super({ key: 'PauseScene' })
  }

  create() {
    this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  update() {
    this.handlePause()
  }

  handlePause() {
    if (this.escapeKey.isDown) {
      this.scene.resume('MainScene');
      this.scene.stop();
    }
  }
}