import { PendingTurnAction } from './pending_turn_actions';
import GameObject from '../game_object';
import Player from '../player';
import Character from '../character';
import Env from '../../env';
import NarrationManager from '../../narration_manager';
import { TILE_CENTER, TILE_SIZE, GAME_OBJECT_FRAME_RATE, PLAYER_MOVE_SPEED } from '../../consts';
/**
* This action will move game object
*/
export class PendingMoveAction extends PendingTurnAction<Character> {
  protected targetTile : Phaser.Point;
  /**
  * Used to update sprite facing while tweening
  */
  protected direction  : Phaser.Point;
  constructor(env: Env, owner : Character, targetTile : Phaser.Point) {
    super(env, owner);
    this.targetTile = targetTile;
    this.direction  = new Phaser.Point(owner.direction.x, owner.direction.y);
  }

  protected buildMoveTween() : Phaser.Tween {
    var moveTween : Phaser.Tween = this.env.game.make.tween(this.owner);
    moveTween.to({
      x: this.targetTile.x * TILE_SIZE,
      y: this.targetTile.y * TILE_SIZE
    }, PLAYER_MOVE_SPEED);
    return moveTween;
  }

  protected performTurn() {
    var moveTween : Phaser.Tween = this.buildMoveTween();
    moveTween.onComplete.addOnce(this.completeAction, this);
    moveTween.onStart.addOnce(() => {
      this.owner.updateSpriteFacingByDirection(this.direction);
    });
    moveTween.start();
  }

  public turnDescription(narration : NarrationManager) : void {}
}

/**
* The same as {PendingMoveAction} excepts it play step sound on move start
*/
export class PendingPlayerMoveAction extends PendingMoveAction {

  constructor(env : Env, owner : Player, targetTile : Phaser.Point) {
    super(env, owner, targetTile);
  }

  protected buildMoveTween() : Phaser.Tween {
    var moveTween : Phaser.Tween = super.buildMoveTween();
    moveTween.onStart.addOnce(() => {
      this.env.sounds.step.play();
    }, this)
    return moveTween;
  }

  public turnDescription(narration : NarrationManager) : void {}
}

/**
* This action plays animation with player movement being blocked by something
*/
export class PendingPlayerMoveBlockedAction extends PendingTurnAction<GameObject> {
  protected targetTile : Phaser.Point;
  private tempPoint : Phaser.Point;
  constructor(env: Env, owner : Player, targetTile : Phaser.Point) {
    super(env, owner);
    this.targetTile = targetTile;
    this.tempPoint  = new Phaser.Point();
  }

  protected performTurn() {
    // calculate direction of movement
    this.tempPoint.set(this.targetTile.x, this.targetTile.y)
                  .subtract(this.owner.tilePosition.x, this.owner.tilePosition.y)
                  .normalize()
                  .multiply(TILE_CENTER, TILE_CENTER);

    //console.log(this.tempPoint);
    var moveTween : Phaser.Tween = this.env.game.make.tween(this.owner);
    moveTween.to({
      x: this.owner.position.x + this.tempPoint.x,
      y: this.owner.position.y + this.tempPoint.y
    }, PLAYER_MOVE_SPEED);
    moveTween.yoyo(true);
    moveTween.onStart.addOnce(() => {
      this.env.sounds.stepBlock.play();
    });
    moveTween.onComplete.addOnce(this.completeAction, this);

    moveTween.start();
  }

  public turnDescription(narration : NarrationManager) : void {
    narration.danger(`${this.owner.name} has been blocked!`);
  }
}
