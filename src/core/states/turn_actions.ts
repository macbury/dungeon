import GameObject from '../objects/game_object';
import { TILE_CENTER, TILE_SIZE, GAME_OBJECT_FRAME_RATE, PLAYER_MOVE_SPEED } from '../consts';
/**
* Simple wrapper around array that contains {TurnAction}
*/
export class TurnActions extends Array<PendingTurnAction<GameObject>> {
  public onComplete : Phaser.Signal;
  private runningActionCount : number;
  constructor() {
    super();
    this.onComplete = new Phaser.Signal();
  }

  private onActionComplete() {
    this.runningActionCount--;
    if (this.runningActionCount < 0) {
      throw "This should not happen!";
    }
    if (this.runningActionCount == 0) {
      this.onComplete.dispatch();
    }
  }

  public run() : Phaser.Signal {
    this.runningActionCount = this.length;
    for (let i = 0; i < this.length; i++) {
      var action : PendingTurnAction<GameObject> = this[i];
      action.run().addOnce(this.onActionComplete, this);
    }

    return this.onComplete;
  }
}

/**
* This class contains pending turn action with all animations and effects that will be runned
*/
export abstract class PendingTurnAction<T extends GameObject> {
  /**
  * Reference to game instance
  */
  protected game : Phaser.Game;
  /**
  * Object that owns action
  */
  protected owner : T;
  /**
  * This signal should be triggered after all action in run is done
  */
  protected onCompleteSignal : Phaser.Signal;

  constructor(game: Phaser.Game, owner : T) {
    this.game             = game;
    this.owner            = owner;
    this.onCompleteSignal = new Phaser.Signal();
  }

  /**
  * Place animation logic for turn. It needs to trigger onCompleteSignal after evrything is done
  */
  protected abstract performTurn() : void;

  /**
  * Run action
  */
  public run() : Phaser.Signal {
    this.performTurn();
    return this.onCompleteSignal;
  }
}

/**
* This action will move game object
*/
export class PendingMoveAction extends PendingTurnAction<GameObject> {
  protected targetTile : Phaser.Point;

  constructor(game: Phaser.Game, owner : GameObject, targetTile : Phaser.Point) {
    super(game, owner);
    this.targetTile = targetTile;
  }

  protected performTurn() {
    var moveTween : Phaser.Tween = this.game.make.tween(this.owner);
    moveTween.to({
      x: this.targetTile.x * TILE_SIZE,
      y: this.targetTile.y * TILE_SIZE
    }, PLAYER_MOVE_SPEED);
    moveTween.onComplete.addOnce(() => { this.onCompleteSignal.dispatch() }, this);
    moveTween.start();
  }
}
