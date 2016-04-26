import GameObject from '../game_object';
/**
* Simple wrapper around array that contains {TurnAction}
*/
export class PendingTurnActions extends Array<PendingTurnAction<GameObject>> {
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
  * Place animation logic for turn. It needs to trigger onCompleteSignal after everything is done
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
