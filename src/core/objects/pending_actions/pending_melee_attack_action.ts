import { PendingTurnAction } from './pending_turn_actions';
import Character from '../character';
import Env from '../../env';
/**
* Plays simple attack effect
*/
export default class PendingMeleeAttackAction extends PendingTurnAction<Character> {
  protected target : Character;

  constructor(env: Env, attacker : Character, target: Character) {
    super(env, attacker);
    this.target = target;
  }

  protected performTurn() {
    var attackTween : Phaser.Tween = this.env.game.add.tween(this.target.sprite).to({
      tint: 0xFF0000
    }, 150, Phaser.Easing.Power0, false, 0, 0, true);
    attackTween.onStart.addOnce(() => {
      this.env.sounds.hit.play();
    });
    attackTween.onComplete.addOnce(() => { this.onCompleteSignal.dispatch() });
    attackTween.start();
  }
}
