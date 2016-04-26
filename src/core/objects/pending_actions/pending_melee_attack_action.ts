import { PendingTurnAction } from './pending_turn_actions';
import Character from '../character';

/**
* Plays simple attack effect
*/
export default class PendingMeleeAttackAction extends PendingTurnAction<Character> {
  protected target : Character;

  constructor(game: Phaser.Game, attacker : Character, target: Character) {
    super(game, attacker);
    this.target = target;
  }

  protected performTurn() {
    var attackTween : Phaser.Tween = this.game.add.tween(this.target.sprite).to({
      tint: 0xFF0000
    }, 150, Phaser.Easing.Power0, false, 0, 0, true);
    attackTween.onComplete.addOnce(() => { this.onCompleteSignal.dispatch() });
    attackTween.start();
  }
}
