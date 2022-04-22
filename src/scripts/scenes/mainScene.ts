// import PhaserLogo from '../objects/phaserLogo'
// import FpsText from '../objects/fpsText'
import Unit from '../objects/unit'
import Player from '../objects/player'
import Enemy from '../objects/enemy'
import Effect from '../objects/effect'

export default class MainScene extends Phaser.Scene {
  fpsText
  arrow_keys: Phaser.Types.Input.Keyboard.CursorKeys
  attack_btn: Phaser.Input.Keyboard.Key
  music?: Phaser.Sound.HTML5AudioSound
  platforms?: Phaser.GameObjects.Group
  player?: Player
  enemies?: Phaser.GameObjects.Group
  enemy?: Enemy
  effects?: Phaser.GameObjects.Group
  slash?: Effect

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    // Set keypresses
    this.arrow_keys = this.input.keyboard.createCursorKeys();
    this.attack_btn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Music
    this.music = this.sound.add('oni') as Phaser.Sound.HTML5AudioSound
    this.music.loop = true;
    this.music.volume = 0.01;
    this.music.play();

    // Background
    this.add.image(400, 300, 'sky');

    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    // Player
    this.player = new Player(this, 100, 450, 'dude', 0)
    this.player.setCollideWorldBounds(true);

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

    // new PhaserLogo(this, this.cameras.main.width / 2, 0)
    // this.fpsText = new FpsText(this)

    // Enemies
    this.enemies = this.physics.add.group({
      classType: Enemy
    });

		this.enemies.children.each(child => {
			const enemy = child as Enemy
			enemy.setTarget(this.player!)
		})

    // Effects
    this.effects = this.physics.add.group();
    this.anims.create({
      key: 'slash_attack',
      frames: this.anims.generateFrameNumbers('effects_slash', { start: 0, end: 4 }),
      frameRate: 10,
      hideOnComplete: true
    });
    this.slash = new Effect(this, 100, 450, 'effects_slash', 0)
    this.slash.visible = false;

    // Physics
    this.physics.add.collider(this.player, this.platforms);
    // this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.overlap(this.slash, this.enemies, this.handleDamage, undefined, this);

    // this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    // this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
  }

  update() {
    // for (var i = 0; i < length; i++) {
    //   const width = parseInt(this.game.config.width.toString())
    //   const height = parseInt(this.game.config.height.toString())
    //   let enemy = new Enemy(this, Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), 'bomb');
    //   this.physics.add.existing(enemy);
    // }

    // random positioned zombie
		this.enemies!.get(
			Phaser.Math.Between(100, 700),
			Phaser.Math.Between(100, 500),
			'bomb'
		)

    // this.fpsText.update()
    this.player!.setVelocity(0);

    // Controls
    this.handleControls();

    this.enemies!.children.each(child => {
			const enemy = child as Enemy
      this.followTarget(enemy, 100);
		})

    this.slash!.setPosition(this.player!.x, this.player!.y-40);
  }

  handleControls() {
    if (this.arrow_keys.left.isDown) {
        this.player!.setVelocityX(-300);
        this.player!.anims.play('left', true);
    }
    else if (this.arrow_keys.right.isDown) {
        this.player!.setVelocityX(300);
        this.player!.anims.play('right', true);
    } else {
        this.player!.anims.play('turn', true);
    }

    if (this.arrow_keys.up.isDown) {
        this.player!.setVelocityY(-300);
        this.player!.anims.play('left', true);
    } else if (this.arrow_keys.down.isDown) {
        this.player!.setVelocityY(300);
        this.player!.anims.play('right', true);
    }

    if (this.attack_btn.isDown) {
      this.handleAttack()
    }
  }

  handleDamage(effect, entity) {
    if (effect.visible) {
      entity.destroy();
    }
  }

  handleAttack() {
    this.slash!.visible = true;
    this.slash!.anims.play('slash_attack');
  }

  followTarget( object: Unit, velocity:number = 1) {
    if (object.scene && object.target ) {
      this.physics.moveToObject(object, object.target, velocity);
    }
  }
}
