import { PendingTurnAction } from './pending_turn_actions';
import Character from '../character';
import Env from '../../env';
/**
* This is base class for all pending attacks. In this class you must create all animations for attack and update {Health#visual} values
*/
abstract class PendingAttackAction extends PendingTurnAction<Character> {
  /**
  * Damage done by this attack to target
  */
  protected damage : number;

  /**
  * Character that is attacked
  */
  protected target : Character;

  /**
  * Target health after attack for current target
  */
  protected targetHealth : number;

  /**
  * Direction to target
  */
  protected direction : Phaser.Point;
  protected currentOwnerPosition : Phaser.Point;
  protected currentTargetPosition : Phaser.Point;

  protected missed : boolean;

  constructor(env: Env, attacker : Character, target: Character, damage : number, missed? : boolean) {
    super(env, attacker);
    this.target = target;
    this.damage = damage;
    this.missed = missed;
    this.targetHealth = target.health.current;
    this.currentOwnerPosition  = new Phaser.Point(attacker.tilePosition.x, attacker.tilePosition.y);
    this.currentTargetPosition = new Phaser.Point(target.tilePosition.x, target.tilePosition.y);
    this.direction             = new Phaser.Point(attacker.direction.x, attacker.direction.y);
  }

  /**
  * Reference to owner
  */
  protected get attacker() : Character {
    return this.owner;
  }
}

export default PendingAttackAction;
