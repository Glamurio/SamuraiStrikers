import { Item } from "../objects/item";
import Player from "../objects/player";
import { Weapon, WeaponConfig, weaponList } from "../objects/weapon";

export default class ShopScene extends Phaser.Scene {
  player: Player
  escapeKey: Phaser.Input.Keyboard.Key
  shopSize: number = 3
  shopWeapons: Array<Weapon> = []
  possibleWeapons: Array<WeaponConfig> = []

  constructor() {
    super({ key: 'ShopScene' })
  }

  init(data) {
    this.player = data.player
  }

  create() {
    this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    const { width, height } = this.scale
    const background = this.add.image(width * 0.5, height * 0.5, 'sky')
      .setDisplaySize(width-100, height-100)

    let exitButton = this.add.image(width - 110, 100, 'ground')
      .setDisplaySize(50, 50)
    this.add.text(exitButton.x, exitButton.y, 'X')
      .setOrigin(0.5)
    exitButton.setInteractive()
    exitButton.on('pointerdown', () => {
      this.returnToMain()
    });

    this.restockShop()
  }

  update() {
    if (this.escapeKey.isDown) {
      this.returnToMain()
    }
  }

  restockShop() {
    const { width, height } = this.scale
    let main = this.scene.get('MainScene');
    this.shopWeapons = []

    this.shopSize = 3
    this.possibleWeapons = weaponList.filter((config: WeaponConfig) => {
      return this.player.getWeapons().every((weapon: Weapon) => weapon.getID() != config.id)
    })

    while(this.possibleWeapons.length && this.shopWeapons.length < this.shopSize) {
      const random = Math.floor((Math.random() * 100) % this.possibleWeapons.length)
      const config = this.possibleWeapons.splice(random, 1)[0]
      const weapon = new Weapon(config.id, undefined, main)
      this.shopWeapons.push(weapon)
    }

    let offset: number = 0
    for (let i in this.shopWeapons) {
      const weapon = this.shopWeapons[i] as Weapon
      let itemButton = this.add.image((width * 0.2) + offset, height * 0.5, 'ground')
        .setDisplaySize(250, 100)
      let itemText = this.add.text(itemButton.x, itemButton.y,
        `${weapon.name}\n\n"${weapon.getDescription()}"\n\nCost: ${weapon.getCost()}`)
        .setOrigin(0.5)
      itemButton.setInteractive()
      offset += itemButton.displayWidth + 10
      itemButton.on('pointerdown', () => {
        itemButton.emit('clicked', itemText, weapon);
      });
      itemButton.on('clicked', (text: Phaser.GameObjects.Text, item: Item) => {
        text.setText('Bought')
        this.buyItem(item)
      })
    }
  }

  buyItem(item: Item) {
    let main = this.scene.get('MainScene');
    item.setOwner(this.player)
    this.player.addItem(item)
    this.player.subtractMoney(item.getCost())
    main.events.emit('onLoseMoney', this.player, item.getCost())
    this.events.emit('onBuyItem', item)
    this.events.emit('onCloseShop')
  }

  returnToMain() {
    this.scene.resume('MainScene', this.player);
    this.scene.stop();
  }

}