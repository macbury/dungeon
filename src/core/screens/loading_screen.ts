import * as Phaser from 'phaser';
import Env from '../env';
import HealthBar from '../ui/health_bar';
import { preloadItems } from '../items/items';
import { preloadMonsters } from '../objects/monsters';
import Player from '../objects/player';
/**
* This screen shows loading screen...
**/
export default class LoadingScreen extends Phaser.State {

  public preload() {
    this.game.load.onFileComplete.add(this.updateLabelProgress, this);

    this.load.image('cursor',  require('cursor.png'));
    this.load.image('tileset', require('tileset.png'));
    Env.preload(this.load);
    HealthBar.preload(this.load);
    preloadItems(this.load);
    preloadMonsters(this.load);
    Player.preload(this.load);
  }

  private updateLabelProgress(progress, cacheKey, success, totalLoaded, totalFiles) {
    console.debug(`Loading: ${progress}%`);
  }

  public create() {

  }

  public update() {
    this.game.state.start('Dungeon', true);
  }
}
