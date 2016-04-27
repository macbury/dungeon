import Mob from '../mob';
import { TILE_SIZE } from '../../consts';
import DungeonScreen from '../../screens/dungeon_screen';
import { PendingTurnAction } from '../pending_actions/pending_turn_actions';
import GameObject from '../game_object';
import Env from '../../env';
export default class Slime extends Mob {
  constructor(env : Env) {
    super(env, 'slime');
  }

  public static preload(load : Phaser.Loader) {
    load.spritesheet('slime', require('slime.png'), TILE_SIZE, TILE_SIZE);
  }

  public takeTurn() : PendingTurnAction<GameObject> {
    return this.wander();
  }
}
