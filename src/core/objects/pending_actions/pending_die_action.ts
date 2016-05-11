import { PendingTurnAction } from './pending_turn_actions';
import Character from '../character';
import NarrationManager from '../../narration_manager';

export default class PendingDieAction extends PendingTurnAction<Character> {

  protected performTurn() : void {
    var tween : Phaser.Tween = this.add.tween(this.owner).to({
      alpha: 0.0
    }, 100);

    tween.onComplete.addOnce(() => {
      this.owner.destroy();
      this.onCompleteSignal.dispatch();
    });
    this.env.sounds.death.play();
    tween.start();
  }


  public turnDescription(narration : NarrationManager) : void {
    narration.info(`${this.owner.name} has died`);
  }
}
