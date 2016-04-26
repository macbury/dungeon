import { PendingTurnAction } from './pending_turn_actions';
import GameObject from '../game_object';
import Player from '../player';
import { TILE_CENTER, TILE_SIZE, GAME_OBJECT_FRAME_RATE, PLAYER_MOVE_SPEED } from '../../consts';
/**
* This action will move game object
*/
export class PendingMoveAction extends PendingTurnAction<GameObject> {
  protected targetTile : Phaser.Point;

  constructor(game: Phaser.Game, owner : GameObject, targetTile : Phaser.Point) {
    super(game, owner);
    this.targetTile = targetTile;
  }

  protected buildMoveTween() : Phaser.Tween {
    var moveTween : Phaser.Tween = this.game.make.tween(this.owner);
    moveTween.to({
      x: this.targetTile.x * TILE_SIZE,
      y: this.targetTile.y * TILE_SIZE
    }, PLAYER_MOVE_SPEED);
    return moveTween;
  }

  protected performTurn() {
    var moveTween : Phaser.Tween = this.buildMoveTween();
    moveTween.onComplete.addOnce(() => { this.onCompleteSignal.dispatch() }, this);
    moveTween.start();
  }
}

/**
* The same as {PendingMoveAction} excepts it play step sound on move start
*/
export class PendingPlayerMoveAction extends PendingMoveAction {
  private stepSound : Phaser.Sound;

  constructor(game: Phaser.Game, owner : Player, targetTile : Phaser.Point) {
    super(game, owner, targetTile);
    this.stepSound = owner.stepSound;
  }

  protected buildMoveTween() : Phaser.Tween {
    var moveTween : Phaser.Tween = super.buildMoveTween();
    moveTween.onStart.addOnce(() => {
      this.stepSound.play();
    }, this)
    return moveTween;
  }
}
