export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    // Images
    this.load.image('phaser-logo', 'assets/img/phaser-logo.png')

    // Sprites
    this.load.image('sky', 'assets/sprites/dummy/sky.png');
    this.load.image('ground', 'assets/sprites/dummy/platform.png');
    this.load.image('star', 'assets/sprites/dummy/star.png');
    this.load.image('bomb', 'assets/sprites/dummy/bomb.png');
    this.load.spritesheet('dude', 'assets/sprites/dummy/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );

    // Effects
    this.load.spritesheet('effects_slash', 'assets/sprites/effects/slash.png',
        { frameWidth: 32, frameHeight: 32 }
    );

    // Audio
    this.load.audio('oni', 'assets/audio/onigiri_no_oni.wav');
  }

  create() {
    this.scene.start('MainScene')

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }
}
