import * as Phaser from 'phaser';
import DungeonState from './states/dungeon_state';

/**
* Main game class that extends Phaser.Game
*/
export default class DungeonGame extends Phaser.Game {
  /**
  * Create game and insert it into container
  * @param container element to insert
  */
  constructor(container : Element) {
    super('100%', '100%', Phaser.WEBGL, container, { create: () => { this.onCreate() }}, false, false);
  }

  /**
  * Initialize all base stuff for game here!
  */
  public onCreate() {
    this.renderer.renderSession.roundPixels = true;
    this.scale.scaleMode              = Phaser.ScaleManager.RESIZE;
    this.scale.fullScreenScaleMode    = Phaser.ScaleManager.RESIZE;
    this.scale.pageAlignVertically    = true;
    this.scale.pageAlignHorizontally  = true;
    this.scale.refresh();
    this.state.add('Dungeon', DungeonState);
    this.state.start('Dungeon');
  }
}
//http://opengameart.org/content/16x16-fantasy-tileset
