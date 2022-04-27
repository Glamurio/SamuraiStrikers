import { Unit } from '../objects/unit'
import Player from '../objects/player'
import { Enemy, EnemyPool } from '../objects/enemy'
import Effect from '../objects/effect'
import { Weapon } from '../objects/weapon'
import { isEffect, isPickup, isPlayer, isUnit } from '../utilities'
import { Pickup, PickupPool } from '../objects/pickup'

export default class MainScene extends Phaser.Scene {
  // Game
  gameOver: boolean = false
  music?: Phaser.Sound.HTML5AudioSound
  platforms?: Phaser.GameObjects.Group
  layer: Phaser.Tilemaps.TilemapLayer

  // Player
  player: Player
  playerWeapons?: Array<Weapon>
  playerCircle: Phaser.Geom.Circle
  effectsOnCircle: Array<Effect> = []
  aimRotation: number
  circleDegree: number = 0

  // Misc
  enemies: EnemyPool
  pickups: PickupPool
  timer: number = 0

  // Controls
  mouse: Phaser.Input.Pointer
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
    this.mouse = this.input.mousePointer
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
    this.layer.setDepth(0)
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
    this.player.setDepth(2)
    this.cameras.main.startFollow(this.player);

    // Enemies
    this.enemies = this.add.existing(new EnemyPool(this))
    this.enemies.setDepth(2)
    this.time.addEvent({
			delay: 200,
			loop: true,
			callback: () => {
				this.spawnEnemy('bomb', 2, 1)
			}
		})

    // Pickups
    this.pickups = this.add.existing(new PickupPool(this))
    this.pickups.setDepth(1)

    // Items
    this.player.addItem(new Weapon('weapon_yumi', this.player, this))

    // Physics
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.overlap(this.player, this.pickups, this.handleCollision, this.checkCollision, this);
    // this.physics.add.overlap(this.player, this.enemies, this.handleCollision, this.checkCollision, this);

    this.playerCircle = new Phaser.Geom.Circle(this.player.x, this.player.y, 40);
    // for (let i in this.playerWeapons) {
    //   // Iterate over each item to get the effect
    //   const weapon = this.playerWeapons[i] as Weapon
    //   this.handleWeaponEffect(weapon, this.player)
    // }

    // Events
    this.events.on('onHitEnemy', (enemy: Unit, weapon: Weapon) => {
      this.dealDamage(enemy, weapon.getDamage())
      weapon.addTarget(enemy)
      this.handleDeath(enemy, weapon)
    }, this);

    this.events.on('onHitPlayer', (player: Player, enemy: Unit) => {
      this.dealDamage(player, 1)
      this.handleDeath(player, undefined, enemy)
    }, this);

    this.events.on('onKillEnemy', (unit: Unit, weapon: Weapon, attacker: Unit) => {
      this.pickups.spawn('pickup_coin', unit.x, unit.y)
    }, this);


  }

  update() {
    // Count frames
    this.timer++

    // Controls
    this.player.setVelocity(0);
    this.handleControls();
    
    // Enemy
    this.enemies.children.each((child) => {
      const enemy = child as Unit
      enemy.setDepth(2)
      this.followTarget(enemy, enemy.getMoveSpeed() / 2);
		})
    this.physics.world.wrap(this.enemies, 500);

    this.playerWeapons = this.player.getWeapons()
    this.aimRotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.mouse.x + this.cameras.main.scrollX, this.mouse.y + this.cameras.main.scrollY)
    this.effectsOnCircle = []
    for (let i in this.playerWeapons) {
      const weapon = this.playerWeapons[i] as Weapon
      this.handleWeaponEffect(weapon, this.player)
    }
    // Phaser.Actions.PlaceOnCircle(
    //   this.effectsOnCircle,
    //   this.playerCircle,
    //   this.aimRotation
    // );
    
    // Focus camera on player
    Phaser.Geom.Rectangle.CenterOn(this.physics.world.bounds, this.player.x, this.player.y)
    

    // Game Over
    this.handleGameOver()

    // Pause
    this.handlePause()
  }

  handleWeaponEffect(weapon: Weapon, unit: Unit) {
    // Place weapon effects
    const effect = weapon.getEffect() as Effect
    const attackMethod = weapon.getAttackMethod()

    if (!effect.hasEvent) {
      this.physics.add.overlap(effect, this.enemies, this.handleCollision, this.checkCollision, this);
      this.time.addEvent({
        delay: weapon.getCooldown() * (1 / this.player.getAttackSpeed()),
        loop: true,
        callback: () => {
          this.handleAttack(weapon, unit)
        }
      })
    }

    switch(attackMethod) {
      case 'circle':
        this.playerCircle.setTo(unit.x, unit.y, 40)
        const point = this.playerCircle.getPoint(this.circleDegree)
        effect.setPosition(point.x, point.y)
        break;
      case 'projectile':
        break
      default:
        effect.setPosition(unit.x, unit.y)
        break
    }

    if (effect.visible && !Phaser.Geom.Rectangle.Contains(this.physics.world.bounds, effect.x, effect.y)) {
      console.log(effect.x, effect.y)
      effect.setActive(false)
      effect.setVisible(false)
    }
    effect.hasEvent = true
  }

  openShop() {
    this.scene.start('shopScene', { player: this.player });
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
    } while (Phaser.Geom.Rectangle.Contains(this.physics.world.bounds, potentialX, potentialY));
    // } while (Math.abs(potentialX - this.player.x) < width / 2 && Math.abs(potentialY - this.player.y) < height / 2);

		const enemy = this.enemies.spawn(potentialX, potentialY, type, enemyConfig) as Enemy

		if (!enemy) {
			return
		}

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
    const pickup = isPickup(collider2) ? collider2 as Pickup : undefined

    if (effect && effect.visible && unit) {
      const weapon = effect.owner as Weapon
      const targets = weapon.getTargets()

      // Ensure the unit has not been recently damaged
      if (!targets.includes(unit)) {
        return true
      }
    } else if (player && unit || player && pickup) {
      return true
    }
    return false
  }

  handleCollision(collider1: any, collider2: any) {
    const player = isPlayer(collider1) ? collider1 as Player : undefined
    const effect = isEffect(collider1) ? collider1 as Effect : undefined
    const unit = isUnit(collider2) ? collider2 as Unit : undefined
    const pickup = isPickup(collider2) ? collider2 as Pickup : undefined

    // Weapon hits enemy
    if (effect && unit) {
      const weapon = effect.owner as Weapon
      this.events.emit('onHitEnemy', unit, weapon);
    // Enemy hits player
    } else if (player && unit) {
      this.events.emit('onHitPlayer', player, unit);
    // Player pickup
    } else if (player && pickup) {
      const amount = 1
      this.pickups.despawn(pickup)
      player.addMoney(amount)
      this.events.emit('onGainMoney', player, amount);
    }
  }

  handleDeath(unit: Unit, weapon?: Weapon, attacker?: Unit) {
    if (unit.getHealth() <= 0) {
      if (isPlayer(unit)) {
        this.gameOver = true
      } else {
        this.events.emit('onKillEnemy', unit, weapon, attacker);
        this.enemies.despawn(unit)
      }
    }
  }

  handleAttack(weapon: Weapon, unit: Unit) {
    const effect = weapon.getEffect() as Effect
    this.circleDegree = Phaser.Math.RadToDeg(this.aimRotation) < 0 ? 1 + (Phaser.Math.RadToDeg(this.aimRotation) / 360) : Phaser.Math.RadToDeg(this.aimRotation) / 360

    effect.setPosition(unit.x, unit.y)
    effect.setRotation(this.aimRotation)

    // Clean up targets when weapon has attacked
    effect.on('animationcomplete', () => weapon.clearTargets());
    
    effect.setScale(2)
    effect.play(effect.getAnimation());
    this.physics.moveTo(effect, this.mouse.x + this.cameras.main.scrollX, this.mouse.y + this.cameras.main.scrollY, weapon.getProjectileSpeed())
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
      this.scene.launch('ShopScene', { player: this.player });
      // this.scene.launch('PauseScene');
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
