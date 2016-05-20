import { PendingTurnAction } from './pending_turn_actions';
import Character from '../character';
import NarrationManager from '../../narration_manager';
import Mob from '../mob';

export default class PendingDieAction extends PendingTurnAction<Character> {

  protected performTurn() : void {
    var tween : Phaser.Tween = this.tween(this.owner).to({
      alpha: 0.0
    }, 500);

    if (this.owner instanceof Mob) {
      let mob : Mob = <Mob>this.owner;
      mob.idleAnimation.stop();
      mob.deathSprite.visible = true;
      mob.deathAnimation.play();
    }

    tween.onComplete.addOnce(() => {
      this.owner.destroy();
    });
    this.env.sounds.death.play();
    tween.start();
  }


  public turnDescription(narration : NarrationManager) : void {
    narration.info(`${this.owner.name} has died`);
  }
}
