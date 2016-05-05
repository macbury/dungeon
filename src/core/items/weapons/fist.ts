import Weapon from './weapon';
import Character from '../../objects/character';
import Mob from '../../objects/mob';
import GameObject from '../../objects/game_object';
import { PendingTurnAction, TurnDirector } from '../../objects/pending_actions/pending_turn_actions';
import Env from '../../env';
import Player from '../../objects/player';
import PendingMeleeAttackAction from '../../objects/pending_actions/pending_melee_attack_action';
/**
* Simple attack using fists.
*/
export default class Fist extends Weapon {

  /**
  * Return true if attacker can atack target using this weapon
  */
  public canAttack(target : Player | Character | Mob | GameObject, env : Env) : boolean {
    return this.owner.tilePosition.distance(target.tilePosition, true) == 1;
  }

  /**
  * Pefrorm attack and create {PendingTurnAction}
  */
  public performAttack(target : Player | Character | Mob, env : Env, turnDirector : TurnDirector) : void {
    var damage : number = this.owner.stats.rollDamage(target.stats);
    target.health.sub(damage);
    console.log(damage);
    turnDirector.addSingle(new PendingMeleeAttackAction(env, this.owner, target, damage));
  }

  public static preload(load : Phaser.Loader) : void {

  }
}
