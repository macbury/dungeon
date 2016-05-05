import * as Phaser from 'phaser';
import DungeonScreen from './screens/dungeon_screen';
import BootScreen from './screens/boot_screen';
import { GAME_SIZE, TILE_SIZE, GAME_WIDTH, GAME_HEIGHT } from './consts';
/**
* Main game class that extends Phaser.Game
*/
export default class DungeonGame extends Phaser.Game {
  /**
  * Create game and insert it into container
  * @param container element to insert
  */
  constructor(container : Element) {
    super(GAME_SIZE, GAME_SIZE, Phaser.AUTO, container, { create: () => { this.onCreate() }}, false, false);
  }

  /**
  * Initialize all base stuff for game here!
  */
  public onCreate() {
    this.stage.smoothed                         = false;

    this.renderer.renderSession.roundPixels     = true;
    this.renderer.renderSession.scaleMode       = PIXI.scaleModes.NEAREST;
    this.scale.scaleMode              = Phaser.ScaleManager.USER_SCALE;
    this.scale.fullScreenScaleMode    = Phaser.ScaleManager.USER_SCALE;
    this.scale.pageAlignVertically    = true;
    this.scale.pageAlignHorizontally  = true;
    this.scale.refresh();

    this.state.add('Boot', BootScreen);
    this.state.add('Dungeon', DungeonScreen);
    this.state.start('Boot');
    this.scale.setResizeCallback(this.onResize, this);
  }

  /**
  * Resize game container to fill whole screen and properly scale it
  */
  onResize(scale : Phaser.ScaleManager, parent : Phaser.Rectangle) {
    var width : number  = GAME_HEIGHT;
    var height : number = GAME_WIDTH;

    if (this.scale.isLandscape) {
      width  = GAME_WIDTH;
      height = GAME_HEIGHT;
    }

    var multiplier : number = Math.min((window.innerHeight / height), (window.innerWidth / width));
    scale.setGameSize(width, height);
    scale.setUserScale(multiplier, multiplier, 0, 0);
  }
}
