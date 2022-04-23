// import PhaserLogo from '../objects/phaserLogo'
// import FpsText from '../objects/fpsText'
import { Unit } from '../objects/unit'
import Player from '../objects/player'
import { EnemyPool } from '../objects/enemy'
import Effect from '../objects/effect'
import { Weapon } from '../objects/weapon'

export default class MainScene extends Phaser.Scene {
  fpsText
  arrow_keys: Phaser.Types.Input.Keyboard.CursorKeys
  attack_btn: Phaser.Input.Keyboard.Key
  music?: Phaser.Sound.HTML5AudioSound
  platforms?: Phaser.GameObjects.Group
  player?: Player
  playerWeapons?: Array<Weapon>
  enemies?: EnemyPool
  effects?: Phaser.GameObjects.Group
  slash?: Effect
  timer: number = 0

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
    const playerConfig = { damage: 1, health: 2 }
    this.player = new Player(this, 100, 450, 'dude', playerConfig)
    this.player.setCollideWorldBounds(true);

    // new PhaserLogo(this, this.cameras.main.width / 2, 0)
    // this.fpsText = new FpsText(this)

    // Enemies
    this.enemies = this.add.existing(new EnemyPool(this))
    this.time.addEvent({
			delay: 1000,
			loop: true,
			callback: () => {
				this.spawnEnemy('bomb', 2, 1)
			}
		})

    // Upgrades
    this.effects = this.physics.add.group();

    const katanaConfig = { damage: 1 }
    this.player.addUpgrade(new Weapon('weapon_katana', this.player, this))

    // Physics
    this.physics.add.collider(this.player, this.platforms);
    // this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.enemies);

    this.playerWeapons = this.player.getWeapons()
    for (let i in this.playerWeapons) {
      // Iterate over each Upgrade to get the effect
      const effect = this.playerWeapons[i].getEffect()!
      this.physics.add.overlap(
        effect,
        this.enemies,
        this.handleCollision,
        this.checkCollision,
        this
      );
      this.time.addEvent({
        delay: 2000,
        loop: true,
        callback: () => {
          this.handleAttack(effect)
        }
      })
    }
  }

  update() {
    // Count frames
    this.timer++

    // this.fpsText.update()
    this.player!.setVelocity(0);

    // Controls
    this.handleControls();
    
    // Enemy
    this.enemies!.children.each((child) => {
      const unit = child as Unit
      this.followTarget(unit as Unit, 75);
      this.handleDeath(unit)
		})

    // Update effect positions
    for (let i in this.playerWeapons) {
      const weapon = this.playerWeapons[i]
      const effect = weapon.getEffect()
      effect.setPosition(this.player!.x, this.player!.y-40);
      effect.on('animationcomplete', () => weapon.clearTargets());
    }
  }

  spawnEnemy(type: string, health:number, damage:number) {
    const enemyConfig = { damage: damage, health: health, target: this.player }

    if (!this.enemies) {
			return
		}

		if (this.enemies.countActive(true) >= 10) {
			return
		}

		const enemy = this.enemies.spawn(
      Phaser.Math.Between(100, 700),
      Phaser.Math.Between(100, 500),
      type, enemyConfig
    )

		if (!enemy) {
			return
		}

		// enemy.setInteractive()
		// 	.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, pointer => {
		// 		this.enemies!.despawn(enemy)
		// 	})

		return enemy
  }

  handleControls() {
    if (this.arrow_keys.left.isDown) {
        this.player!.setVelocityX(-150);
        this.player!.anims.play('left', true);
    }
    else if (this.arrow_keys.right.isDown) {
        this.player!.setVelocityX(150);
        this.player!.anims.play('right', true);
    } else {
        this.player!.anims.play('turn', true);
    }

    if (this.arrow_keys.up.isDown) {
        this.player!.setVelocityY(-150);
        this.player!.anims.play('left', true);
    } else if (this.arrow_keys.down.isDown) {
        this.player!.setVelocityY(150);
        this.player!.anims.play('right', true);
    }
  }
  
  checkCollision(effect, unit) {
    effect = effect as Effect
    unit = unit as Unit
    if (effect.visible) {
      const weapon = effect.owner as Weapon
      const targets = weapon.getTargets()

      // Ensure the unit has not been recently damaged
      if (!targets.includes(unit)) {
        return true
      }
    }
    return false
  }

  handleCollision(effect: any, unit: any) {
    effect = effect as Effect
    unit = unit as Unit
    const weapon = effect.owner as Weapon
    this.dealDamage(unit, weapon.getDamage())
    weapon.addTarget(unit)
  }

  handleDeath(unit: Unit) {
    if (unit.getHealth() <= 0) {
      this.enemies!.despawn(unit)
    }
  }

  handleAttack(effect: Effect) {
    effect.visible = true;
    effect.anims.play(effect.getAnimation());
  }

  dealDamage(target: Unit, damage: number) {
    let health = target.getHealth()
    target.setHealth(health-damage)
  }

  followTarget(object: Unit, velocity: number = 1) {
    if (object && object.scene) {
      const target = object.getTarget()
      if (target) {
        this.physics.moveToObject(object, target, velocity);
      }
    }
  }
}
