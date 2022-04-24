import { Unit } from '../objects/unit'
import Player from '../objects/player'
import { Enemy, EnemyPool } from '../objects/enemy'
import Effect from '../objects/effect'
import { Weapon } from '../objects/weapon'
import { isEffect, isPlayer, isUnit } from '../utilities'

export default class MainScene extends Phaser.Scene {
  gameOver: boolean = false
  music?: Phaser.Sound.HTML5AudioSound
  platforms?: Phaser.GameObjects.Group
  player: Player
  playerWeapons?: Array<Weapon>
  enemies?: EnemyPool
  slash?: Effect
  timer: number = 0
  background: Phaser.GameObjects.Image
  layer: Phaser.Tilemaps.TilemapLayer
  angle: number

  // Controls
  arrowKeys: Phaser.Types.Input.Keyboard.CursorKeys
  escapeKey: Phaser.Input.Keyboard.Key
  keyA: Phaser.Input.Keyboard.Key
  keyS: Phaser.Input.Keyboard.Key
  keyD: Phaser.Input.Keyboard.Key
  keyW: Phaser.Input.Keyboard.Key
  gamepad?: Phaser.Input.Gamepad.Gamepad

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    // Set controls
    this.arrowKeys = this.input.keyboard.createCursorKeys();
    this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    if (this.input.gamepad.total > 0) {
      this.gamepad = this.input.gamepad.pad1;
    }

    // Music
    this.music = this.sound.add('oni') as Phaser.Sound.HTML5AudioSound
    this.music.loop = true;
    this.music.volume = 0.01;
    this.music.play();

    // Background
    const map = this.make.tilemap({ width: this.cameras.main.width, height: this.cameras.main.height, tileWidth: 32, tileHeight: 32 });
    const tiles = map.addTilesetImage('floor', undefined, 32, 32);
    const weightConfig = [
      { index: 0, weight: 10 },
      { index: 1, weight: 2 },
      { index: 2, weight: 5 },
      { index: 3, weight: 1 },
      { index: 4, weight: 2 },
      { index: 5, weight: 1 },
      { index: 6, weight: 1 },
      { index: 7, weight: 1 },
    ]
    this.layer = map.createBlankLayer('layer1', tiles);
    this.layer.weightedRandomize(weightConfig)

    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    // Player
    const playerConfig = { damage: 1, health: 2 }
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.player = new Player(this, screenCenterX, screenCenterY, 'dude', playerConfig)
    this.player.setCollideWorldBounds(false);
    this.cameras.main.startFollow(this.player);

    // new PhaserLogo(this, this.cameras.main.width / 2, 0)
    // this.fpsText = new FpsText(this)

    // Enemies
    this.enemies = this.add.existing(new EnemyPool(this))
    this.time.addEvent({
			delay: 200,
			loop: true,
			callback: () => {
				this.spawnEnemy('bomb', 2, 1)
			}
		})

    // Items
    this.player.addItem(new Weapon('weapon_katana', this.player, this))

    // Physics
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.overlap(this.player, this.enemies, this.handleCollision, this.checkCollision);

    this.playerWeapons = this.player.getWeapons()
    for (let i in this.playerWeapons) {
      // Iterate over each Item to get the effect
      const weapon = this.playerWeapons[i] as Weapon
      const effect = weapon.getEffect()! as Effect
      this.physics.add.overlap(
        effect,
        this.enemies,
        this.handleCollision,
        this.checkCollision,
        this
      );
      this.time.addEvent({
        delay: weapon.getCooldown() * (1 / this.player.getAttackSpeed()),
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
    this.player.setVelocity(0);

    // Controls
    this.handleControls();
    
    // Enemy
    this.enemies!.children.each((child) => {
      const unit = child as Unit
      this.followTarget(unit as Unit, unit.getMoveSpeed() / 2);
      this.handleDeath(unit)
		})
    this.physics.world.wrap(this.enemies!, 500);

    // Update effect
    for (let i in this.playerWeapons) {
      const weapon = this.playerWeapons[i] as Weapon
      const effect = weapon.getEffect() as Effect

      // Place effect in circle around player
      const circle = new Phaser.Geom.Circle(this.player.x, this.player.y, 40);
      const mouse = this.input.mousePointer
      const rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, mouse.x + this.cameras.main.scrollX, mouse.y + this.cameras.main.scrollY)
      Phaser.Actions.PlaceOnCircle(
        [effect],
        circle,
        rotation
      );
      effect.setRotation(rotation)

      // Clean up targets when weapon has attacked
      effect.on('animationcomplete', () => weapon.clearTargets());
    }

    Phaser.Geom.Rectangle.CenterOn(this.physics.world.bounds, this.player.x, this.player.y,)

    // Game Over
    this.handleDeath(this.player)
    this.handleGameOver()

    // Pause
    this.handlePause()
  }

  spawnEnemy(type: string, health:number, damage:number) {
    const enemyConfig = { damage: damage, health: health, target: this.player }

    if (!this.enemies) {
			return
		}

		if (this.enemies.countActive(true) >= this.enemies.maxSize) {
			return
		}
    const height:number = this.cameras.main.height
    const width:number = this.cameras.main.width
    let potentialX: number
    let potentialY: number
    do {
      potentialX = Phaser.Math.Between(this.player.x + width + 499, this.player.x - width - 499);
      potentialY = Phaser.Math.Between(this.player.y + height + 500, this.player.y - height - 500);
    } while (Math.abs(potentialX - this.player.x) < width / 2 && Math.abs(potentialY - this.player.y) < height / 2);

		const enemy = this.enemies.spawn(potentialX, potentialY, type, enemyConfig) as Enemy

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
    const moveSpeed = this.player.getMoveSpeed()
    if (this.arrowKeys.left.isDown || this.keyA.isDown) {
        this.player.setVelocityX(-moveSpeed);
        this.player.anims.play('left', true);
    }
    else if (this.arrowKeys.right.isDown || this.keyD.isDown) {
        this.player.setVelocityX(moveSpeed);
        this.player.anims.play('right', true);
    } else {
        this.player.anims.play('turn', true);
    }

    if (this.arrowKeys.up.isDown || this.keyW.isDown) {
        this.player.setVelocityY(-moveSpeed);
        this.player.anims.play('left', true);
    } else if (this.arrowKeys.down.isDown || this.keyS.isDown) {
        this.player.setVelocityY(moveSpeed);
        this.player.anims.play('right', true);
    }
  }
  
  checkCollision(collider1: any, collider2: any) {
    const player = isPlayer(collider1) ? collider1 as Player : undefined
    const effect = isEffect(collider1) ? collider1 as Effect : undefined
    const unit = isUnit(collider2) ? collider2 as Unit : undefined

    if (effect && effect.visible && unit) {
      const weapon = effect.owner as Weapon
      const targets = weapon.getTargets()

      // Ensure the unit has not been recently damaged
      if (!targets.includes(unit)) {
        return true
      }
    } else if (player && unit) {
      return true
    }
    return false
  }

  handleCollision(collider1: any, collider2: any) {
    const player = isPlayer(collider1) ? collider1 as Player : undefined
    const effect = isEffect(collider1) ? collider1 as Effect : undefined
    const unit = isUnit(collider2) ? collider2 as Unit : undefined

    if (effect && unit) {
      const weapon = effect.owner as Weapon
      this.dealDamage(unit, weapon.getDamage())
      weapon.addTarget(unit)
    } else if (player && unit) {
      let health = player.getHealth()
      player.setHealth(health-1)
    }
  }

  handleDeath(unit: Unit) {
    if (unit.getHealth() <= 0) {
      if (isPlayer(unit)) {
        this.gameOver = true
      } else {
        this.enemies!.despawn(unit)
      }
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

  handleGameOver() {
    if (this.gameOver) {
      this.registry.destroy();
      this.scene.restart();
      this.gameOver = false
    }
  }

  handlePause() {
    if (this.escapeKey.isDown) {
      this.scene.launch('PauseScene');
      this.scene.pause();
    }
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
