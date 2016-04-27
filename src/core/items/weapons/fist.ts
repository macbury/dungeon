import Weapon from './weapon';
import Character from '../../objects/character';
import Mob from '../../objects/mob';
import GameObject from '../../objects/game_object';
import { PendingTurnAction } from '../../objects/pending_actions/pending_turn_actions';
import Env from '../../env';
import PendingMeleeAttackAction from '../../objects/pending_actions/pending_melee_attack_action';
/**
* Simple attack using fists.
*/
export default class Fist extends Weapon {

  /**
  * Return true if attacker can atack target using this weapon
  */
  public canAttack(target : Character | Mob | GameObject, env : Env) : boolean {
    return true;
  }

  /**
  * Pefrorm attack and create {PendingTurnAction}
  */
  public performAttack(target : Character | Mob, env : Env) : PendingTurnAction<Character> {
    return new PendingMeleeAttackAction(env.game, this.owner, target);
  }

  public static preload(load : Phaser.Loader) : void {

  }
}
