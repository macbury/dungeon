import * as Phaser from 'phaser';
import DungeonScreen from './screens/dungeon_screen';
import BootScreen from './screens/boot_screen';
import { GAME_SIZE, TILE_SIZE, GAME_WIDTH, GAME_HEIGHT } from './consts';
import ResolutionUtils from './utils/resolution_utils';

/**
* Main game class that extends Phaser.Game
*/
export default class DungeonGame extends Phaser.Game {
  protected resolutionCalculator : ResolutionUtils;

  /**
  * Create game and insert it into container
  * @param container element to insert
  */
  constructor(container : Element, resolution : ResolutionUtils) {
    super(resolution.canvas.width, resolution.canvas.height, Phaser.AUTO, container, { create: () => { this.onCreate() }}, false, false);
    this.resolutionCalculator = resolution;
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
    this.resolutionCalculator.recalculate();
    let prevWidth   = this.width;
    let prevHeight  = this.height;
    let currWidth   = this.resolutionCalculator.canvas.width;
    let currHeight  = this.resolutionCalculator.canvas.height;

    if (this.scale.isPortrait) {
      currWidth   = this.resolutionCalculator.canvas.height;
      currHeight  = this.resolutionCalculator.canvas.width;
    }

    scale.setGameSize(currWidth, currHeight);
    scale.setUserScale(this.resolutionCalculator.scale, this.resolutionCalculator.scale, 0, 0);

    if (prevWidth != currWidth || prevHeight != currHeight) {
      this.state.resize(currWidth, currHeight);
    }
  }

  public static boot(container : Element) : DungeonGame {
    return new DungeonGame(container, new ResolutionUtils());
  }
}
