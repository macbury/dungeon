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
  }

  protected setupStatsAndEquipment() {
    this.fistWeapon        = new Fist(this.game, this);
    this.baseStats.health  = 8;
    this.baseStats.attack  = 4;
    this.baseStats.defense = 2;
  }

  public static preload(load : Phaser.Loader) {
    load.spritesheet('slime', require('slime.png'), TILE_SIZE, TILE_SIZE);
  }

  public takeTurn(turnDirector : TurnDirector) : boolean {
    if (this.fistWeapon.canAttack(this.env.player, this.env)) {
      this.fistWeapon.performAttack(this.env.player, this.env, turnDirector);
      return true;
    } else {
      this.wander(turnDirector);
      return false;
    }
  }
}
