import Weapon from './weapon';
import Character from '../../objects/character';
import Mob from '../../objects/mob';
import GameObject from '../../objects/game_object';
import { PendingTurnAction, TurnDirector } from '../../objects/pending_actions/pending_turn_actions';
import Env from '../../env';
import Player from '../../objects/player';
import PendingMeleeAttackAction from '../../objects/pending_actions/pending_melee_attack_action';
/**
* Simple attack using fists. Its power is only based on character attack
*/
export default class Fist extends Weapon {

  constructor(game : Phaser.Game, owner : Mob | Player) {
    super(game, owner);
    this.stats.minAttack = 0;
    this.stats.maxAttack = 0;
  }

  /**
  * Return true if attacker can atack target using this weapon
  */
  public canAttack(target : Player | Character | Mob | GameObject, env : Env) : boolean {
    return this.owner.distance(target) == 1 && this.owner.canSee(target);
  }

  /**
  * Pefrorm attack and create {PendingTurnAction}
  */
  public performAttack(target : Player | Character | Mob, env : Env, turnDirector : TurnDirector) : void {
    if (this.owner.stats.rollLuck(target.stats, env.game.rnd) >= 0) {
      var damage : number = this.owner.stats.rollDamage(target.stats, this.stats, env.game.rnd);
      target.health.sub(damage);
      turnDirector.addSingle(new PendingMeleeAttackAction(env, this.owner, target, damage));
    } else {
      turnDirector.addSingle(new PendingMeleeAttackAction(env, this.owner, target, damage, true));
    }
  }

  public static preload(load : Phaser.Loader) : void {

  }

  public getIconName() : string {
    return null;
  }
}
