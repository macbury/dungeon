import * as Phaser from 'phaser';
import Env from '../env';
import { preloadItems } from '../items/items';
import { preloadMonsters } from '../objects/monsters';
import Player from '../objects/player';
import { NARRATOR_TEXT_STYLE_INFO } from '../consts';
/**
* This screen shows loading screen...
**/
export default class LoadingScreen extends Phaser.State {
  private loadingText : Phaser.Text;
  public preload() {
    this.game.load.onFileComplete.add(this.updateLabelProgress, this);

    this.load.image('cursor',  require('cursor.png'));
    this.load.image('tileset', require('tileset.png'));
    Env.preload(this.load);
    preloadItems(this.load);
    preloadMonsters(this.load);
    Player.preload(this.load);

    this.loadingText = this.add.text(10,10, "Loading... ", NARRATOR_TEXT_STYLE_INFO)
  }

  private updateLabelProgress(progress, cacheKey, success, totalLoaded, totalFiles) {
    this.loadingText.text = `Loading: ${progress}%`;
  }

  public create() {

  }

  public update() {
    this.game.state.start('Dungeon', true);
  }
}
