import { PendingTurnAction } from './pending_turn_actions';
import Character from '../character';

/**
* This is base class for all pending attacks
*/
abstract class PendingAttackAction extends PendingTurnAction<Character> {

}

export default PendingAttackAction;
