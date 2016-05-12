import { PendingTurnAction } from './pending_turn_actions';
import Player from '../player';
import NarrationManager from '../../narration_manager';

export default class PendingPlayerDieAction extends PendingTurnAction<Player> {

  protected performTurn() : void {
    var tween : Phaser.Tween = this.add.tween(this.owner).to({
      alpha: 0.0
    }, 100);
    console.log(this.owner);
    tween.onComplete.addOnce(this.completeAction, this);

    tween.start();
  }

  public turnDescription(narration : NarrationManager) : void {
    narration.info(`You have died...`);
  }
}
