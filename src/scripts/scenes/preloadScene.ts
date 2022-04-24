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

    // Floor
    this.load.image('floor', 'assets/sprites/floor.png');

    // Effects
    this.load.spritesheet('effects_slash', 'assets/sprites/test_slash.png',
      { frameWidth: 32, frameHeight: 64 }
    );

    // Pickups
    this.load.image('pickup_coin', 'assets/sprites/dungeon/frames/coin_anim_f0.png');
    

    // Audio
    this.load.audio('oni', 'assets/audio/onigiri_no_oni.wav');
  }

  create() {
    //// Animations
    // Items
    this.anims.create({
      key: 'katana_attack',
      frames: this.anims.generateFrameNumbers('effects_slash', { start: 0, end: 0 }),
      frameRate: 10,
      hideOnComplete: true
    });

    // Chars
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

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
