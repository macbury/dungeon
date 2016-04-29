import Mob from '../mob';
import { TILE_SIZE } from '../../consts';
import Fist from '../../items/weapons/fist';
import Env from '../../env';
import {PendingTurnAction} from '../pending_actions/pending_turn_actions';
import GameObject from '../game_object';

const ANT_SPRITE_NAME = 'black_ant';

export default class Ant extends Mob {
  protected fistWeapon : Fist;
  constructor(env : Env) {
    super(env, ANT_SPRITE_NAME);

    this.fistWeapon = new Fist(this.game, this);
  }

  public static preload(load : Phaser.Loader) {
    load.spritesheet(ANT_SPRITE_NAME, require('black_ant.png'), TILE_SIZE, TILE_SIZE);
  }

  public takeTurn() : PendingTurnAction<GameObject> {
    if (this.fistWeapon.canAttack(this.env.player, this.env)) {
      return this.fistWeapon.performAttack(this.env.player, this.env);
    } else {
      return this.wander();
    }
  }
}
