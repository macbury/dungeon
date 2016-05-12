import Character from '../character';
import Player from '../player';
import Env from '../../env';
import { TILE_CENTER, QUICK_ATTACK_SPEED } from '../../consts';
import NarrationManager from '../../narration_manager';
import PendingAttackAction from './pending_attack_action';
/**
* Plays simple attack effect
*/
export default class PendingMeleeAttackAction extends PendingAttackAction {

  constructor(env: Env, attacker : Character, target: Character, damage : number, missed? : boolean) {
    super(env, attacker, target, damage, missed);
  }

  /**
  * Animate character that is hurted and display damage text
  */
  protected buildAttackSuccessTween() : Phaser.Tween {
    var attackTween : Phaser.Tween = this.env.game.add.tween(this.target.sprite).to({
      tint: 0xFF0000
    }, 150, Phaser.Easing.Power0, false, 0, 0, true);
    attackTween.onStart.addOnce(() => {
      this.env.sounds.hit.play();
      this.target.health.visual = this.targetHealth;
      this.target.statusText(`-${this.damage}`).onComplete.addOnce(this.completeAction, this);
    });

    return attackTween;
  }

  protected performTurn() {
    /**
    * Animate attack movement
    */
    var tempDir : Phaser.Point = new Phaser.Point(this.currentTargetPosition.x, this.currentTargetPosition.y);
    tempDir.subtract(this.currentOwnerPosition.x, this.currentOwnerPosition.y)
           .normalize()
           .multiply(TILE_CENTER, TILE_CENTER);
    var moveTween : Phaser.Tween = this.env.game.make.tween(this.owner);
    moveTween.to({
     x: this.owner.position.x + tempDir.x,
     y: this.owner.position.y + tempDir.y
    }, QUICK_ATTACK_SPEED);
    moveTween.yoyo(true);
    moveTween.easing(Phaser.Easing.Exponential.Out);
    moveTween.onStart.addOnce(() => {
      this.owner.updateSpriteFacingByDirection(this.direction);
      if (this.missed) {
        this.env.sounds.miss.play();
        this.target.statusText("Miss").onComplete.addOnce(this.completeAction, this);
      } else {
        this.buildAttackSuccessTween().start();
      }

    });
    moveTween.start();
  }

  public turnDescription(narration : NarrationManager) : void {
    if (this.missed) {
      narration.info(`${this.attacker.name} missed ${this.target.name}`);
    } else {
      narration.info(`${this.attacker.name} did ${this.damage} damage to ${this.target.name}`);
    }

  }
}
