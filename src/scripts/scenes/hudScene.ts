import { Player } from "../objects/player";
import { Unit } from "../objects/unit";
import { Weapon } from "../objects/weapon";

export default class HUDScene extends Phaser.Scene {
  money:number = 0
  killedEnemies:number = 0
  
  constructor () {
    super({ key: 'HUDScene', active: true });
  }

  create () {
      //  Our Text object to display the Score
      let moneyText = this.add.text(10, 10, `Money ${this.money.toString()}`, { font: '20px Arial' });
      let killText = this.add.text(10, 40, `Enemies killed: ${this.killedEnemies.toString()}`, { font: '20px Arial' });
      moneyText.setFontSize(20).setScrollFactor(0)
      killText.setFontSize(20).setScrollFactor(0)

      //  Grab a reference to the Game Scene
      let main = this.scene.get('MainScene');

      //  Listen for events from it
      main.events.on('onGainMoney', (player: Player, amount: number) => {
        moneyText.setText(`Money ${player.getMoney().toString()}`);
      }, this);

      main.events.on('onLoseMoney', (player: Player, amount: number) => {
        moneyText.setText(`Money ${player.getMoney().toString()}`);
      }, this);

      main.events.on('onKillEnemy',  (unit: Unit, weapon: Weapon) => {
        this.killedEnemies += 1;
        killText.setText(`Enemies killed: ${this.killedEnemies.toString()}`);
      }, this);
  }
}