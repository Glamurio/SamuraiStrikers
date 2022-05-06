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
    this.load.image('enemy_soldier', 'assets/sprites/dummy/bomb.png');
    this.load.spritesheet('character_orenji', 'assets/sprites/dummy/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );

    // Floor
    this.load.image('floor', 'assets/sprites/floor.png');

    // Effects
    this.load.spritesheet('effects_slash', 'assets/sprites/test_slash.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('effects_slash_small', 'assets/sprites/test_slash_small.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('effects_slam', 'assets/sprites/test_slam.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('effects_circle_half', 'assets/sprites/test_circle.png', { frameWidth: 128, frameHeight: 64 });
    this.load.spritesheet('effects_shuriken', 'assets/sprites/test_shuriken.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('effects_arrow', 'assets/sprites/test_arrow.png', { frameWidth: 32, frameHeight: 32 });

    // Icons
    this.load.image('icon_katana', 'assets/sprites/Buffs/attack_boost.png');
    this.load.image('icon_kanabo', 'assets/sprites/Buffs/knockback_boost.png');
    this.load.image('icon_naginata', 'assets/sprites/Debuffs/attack_down.png');
    this.load.image('icon_shuriken', 'assets/sprites/Buffs/magic_amplification.png');
    this.load.image('icon_yumi', 'assets/sprites/Spells/thorn_vine_spell.png');
    this.load.image('icon_wakizashi', 'assets/sprites/Debuffs/disarmed.png');

    // Pickups
    this.load.image('pickup_coin', 'assets/sprites/dungeon/frames/coin_anim_f0.png');

    // Audio
    this.load.audio('oni', 'assets/audio/onigiri_no_oni.wav');
  }

  create() {
    //// Animations
    // Weapons
    this.anims.create({
      key: 'attack_katana',
      frames: this.anims.generateFrameNumbers('effects_slash', { start: 0, end: 0 }),
      frameRate: 5,
      showOnStart: true,
      hideOnComplete: true
    });
    this.anims.create({
      key: 'attack_kanabo',
      frames: this.anims.generateFrameNumbers('effects_slam', { start: 0, end: 0 }),
      frameRate: 5,
      showOnStart: true,
      hideOnComplete: true
    });
    this.anims.create({
      key: 'attack_shuriken',
      frames: this.anims.generateFrameNumbers('effects_shuriken', { start: 0, end: 0 }),
      frameRate: 0.1,
      showOnStart: true,
      hideOnComplete: false
    });
    this.anims.create({
      key: 'attack_yumi',
      frames: this.anims.generateFrameNumbers('effects_arrow', { start: 0, end: 0 }),
      frameRate: 0.1,
      showOnStart: true,
      hideOnComplete: false
    });
    this.anims.create({
      key: 'attack_naginata',
      frames: this.anims.generateFrameNumbers('effects_circle_half', { start: 0, end: 0 }),
      frameRate: 5,
      showOnStart: true,
      hideOnComplete: true
    });
    this.anims.create({
      key: 'attack_wakizashi',
      frames: this.anims.generateFrameNumbers('effects_slash_small', { start: 0, end: 0 }),
      frameRate: 5,
      showOnStart: true,
      hideOnComplete: true
    });

    // Chars
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('character_orenji', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'character_orenji', frame: 4 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('character_orenji', { start: 5, end: 8 }),
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
