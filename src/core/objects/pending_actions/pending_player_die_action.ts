import { PendingTurnAction } from './pending_turn_actions';
import Player from '../player';
import NarrationManager from '../../narration_manager';

export default class PendingPlayerDieAction extends PendingTurnAction<Player> {

  protected performTurn() : void {
    this.tween(this.owner).to({
      alpha: 0.0
    }, 100).start();
  }

  public turnDescription(narration : NarrationManager) : void {
    narration.info(`You have died...`);
  }
}
