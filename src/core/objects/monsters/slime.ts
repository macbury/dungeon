import Mob from '../mob';
import { TILE_SIZE } from '../../consts';
import DungeonScreen from '../../screens/dungeon_screen';

export default class Slime extends Mob {
  constructor(screen : DungeonScreen) {
    super(screen, 'slime');
  }

  public static preload(load : Phaser.Loader) {
    load.spritesheet('slime', require('slime.png'), TILE_SIZE, TILE_SIZE);
  }

  public takeTurn() : Phaser.Tween {
    return this.wander();
  }
}
