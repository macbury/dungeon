import { PendingTurnAction } from './pending_turn_actions';
import Character from '../character';
import Env from '../../env';
/**
* This is base class for all pending attacks
*/
abstract class PendingAttackAction extends PendingTurnAction<Character> {
  /**
  * Damage done by this attack
  */
  protected damage : number;

  constructor(env: Env, attacker : Character, damage : number) {
    super(env, attacker)
    this.damage = damage;
  }

  /**
  * Reference to owner
  */
  protected get attacker() : Character {
    return this.owner;
  }
}

export default PendingAttackAction;
