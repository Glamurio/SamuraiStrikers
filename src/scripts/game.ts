import 'phaser'
import HUDScene from './scenes/hudScene'
import MainScene from './scenes/mainScene'
import PauseScene from './scenes/pauseScene'
import PreloadScene from './scenes/preloadScene'
import ShopScene from './scenes/shopScene'

const DEFAULT_WIDTH = 1280
const DEFAULT_HEIGHT = 720

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  disableContextMenu: true,
  scale: {
    parent: 'phaser-game',
    pixelArt: true,
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, MainScene, ShopScene, HUDScene, PauseScene],
  input: {
    gamepad: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    },
    fps: 60
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
