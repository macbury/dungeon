import Mob from '../mob';
import { TILE_SIZE } from '../../consts';
import DungeonScreen from '../../screens/dungeon_screen';
import { PendingTurnAction, TurnDirector } from '../pending_actions/pending_turn_actions';
import GameObject from '../game_object';
import Env from '../../env';
import Fist from '../../items/weapons/fist';
/**
* First simple monster. It ai is just wandering
*/
export default class Slime extends Mob {
  protected fistWeapon : Fist;
  constructor(env : Env) {
    super(env, 'slime');

    this.fistWeapon = new Fist(this.game, this);
  }

  public static preload(load : Phaser.Loader) {
    load.spritesheet('slime', require('slime.png'), TILE_SIZE, TILE_SIZE);
  }

  public takeTurn(turnDirector : TurnDirector) : boolean {
    if (this.fistWeapon.canAttack(this.env.player, this.env)) {
      turnDirector.addSingle(this.fistWeapon.performAttack(this.env.player, this.env));
      return true;
    } else {
      this.wander(turnDirector);
      return false;
    }
  }
}
