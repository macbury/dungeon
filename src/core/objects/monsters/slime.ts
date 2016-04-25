import Mob from '../mob';
import { TILE_SIZE } from '../../consts';
export default class Slime extends Mob {
  constructor(game : Phaser.Game) {
    super(game, 'slime');
  }

  public static preload(load : Phaser.Loader) {
    load.spritesheet('slime', require('slime.png'), TILE_SIZE, TILE_SIZE);
  }
}
