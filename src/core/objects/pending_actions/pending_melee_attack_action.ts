import Character from '../character';
import Env from '../../env';
import { TILE_CENTER, QUICK_ATTACK_SPEED } from '../../consts';
import NarrationManager from '../../narration_manager';
import PendingAttackAction from './pending_attack_action';
/**
* Plays simple attack effect
*/
export default class PendingMeleeAttackAction extends PendingAttackAction {
  protected target : Character;
  protected direction : Phaser.Point;
  protected currentOwnerPosition : Phaser.Point;
  protected currentTargetPosition : Phaser.Point;

  constructor(env: Env, attacker : Character, target: Character) {
    super(env, attacker);
    this.target                = target;
    this.currentOwnerPosition  = new Phaser.Point(attacker.tilePosition.x, attacker.tilePosition.y);
    this.currentTargetPosition = new Phaser.Point(target.tilePosition.x, target.tilePosition.y);
    this.direction             = new Phaser.Point(attacker.direction.x, attacker.direction.y);
  }

  protected performTurn() {
    /**
    * Animate hurt effect
    */
    var attackTween : Phaser.Tween = this.env.game.add.tween(this.target.sprite).to({
      tint: 0xFF0000
    }, 150, Phaser.Easing.Power0, false, 0, 0, true);
    attackTween.onStart.addOnce(() => {
      this.env.sounds.hit.play();
    });
    attackTween.onComplete.addOnce(() => { this.onCompleteSignal.dispatch() });

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
      attackTween.start();
    });
    moveTween.start();
  }

  public turnDescription(narration : NarrationManager) : void {
    //TODO: make this more dynamic
    narration.danger("Player attacked monster!");
  }
}
