import Weapon from './weapon';
import Character from '../../objects/character';
import Mob from '../../objects/mob';
import GameObject from '../../objects/game_object';
import { PendingTurnAction, TurnDirector } from '../../objects/pending_actions/pending_turn_actions';
import Env from '../../env';
import Player from '../../objects/player';
import PendingMeleeAttackAction from '../../objects/pending_actions/pending_melee_attack_action';

export default class Sword extends Weapon {
  constructor(game : Phaser.Game, owner : Mob | Player) {
    super(game, owner);
    this.stats.minAttack = 1;
    this.stats.maxAttack = 5;
  }

  /**
  * Return true if attacker can atack target using this weapon
  */
  public canAttack(target : Player | Character | Mob | GameObject, env : Env) : boolean {
    return this.owner.distance(target) == 1 && this.owner.inLineOfSight(target);
  }

  /**
  * Pefrorm attack and create {PendingTurnAction}
  */
  public performAttack(target : Player | Character | Mob, env : Env, turnDirector : TurnDirector) : void {
    var damage : number = this.owner.stats.rollDamage(target.stats, this.stats, env.game.rnd);
    target.health.sub(damage);
    turnDirector.addSingle(new PendingMeleeAttackAction(env, this.owner, target, damage));
  }

  public static preload(load : Phaser.Loader) : void {

  }

  public getIconName() : string {
    return null;
  }
}
