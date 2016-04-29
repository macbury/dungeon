import * as Phaser from 'phaser';
import DungeonScreen from './screens/dungeon_screen';
import BootScreen from './screens/boot_screen';
import ResolutionCalculator from './utils/resolution';


/**
* Main game class that extends Phaser.Game
*/
export default class DungeonGame extends Phaser.Game {
  /**
  * Create game and insert it into container
  * @param container element to insert
  */
  constructor(container : Element) {
    var resolution = new ResolutionCalculator();
    super(resolution.width, resolution.height, Phaser.AUTO, container, { create: () => { this.onCreate() }}, false, false);
  }

  /**
  * Initialize all base stuff for game here!
  */
  public onCreate() {
    this.stage.smoothed                         = false;

    this.renderer.renderSession.roundPixels     = true;
    this.renderer.renderSession.scaleMode       = PIXI.scaleModes.NEAREST;
    this.scale.scaleMode              = Phaser.ScaleManager.SHOW_ALL;
    this.scale.fullScreenScaleMode    = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignVertically    = true;
    this.scale.pageAlignHorizontally  = true;
    this.scale.refresh();

    this.state.add('Boot', BootScreen);
    this.state.add('Dungeon', DungeonScreen);

    this.state.start('Boot');
  }
}
//http://opengameart.org/content/16x16-fantasy-tileset
