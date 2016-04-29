import GameObject from '../game_object';
import Env from '../../env';
import NarrationManager from '../../narration_manager';
/**
* Simple wrapper around array that contains {TurnAction}
*/
export class PendingTurnActions extends Array<PendingTurnAction<GameObject>> {
  public onComplete : Phaser.Signal;
  private runningActionCount : number;
  constructor() {
    super();
    this.onComplete  = new Phaser.Signal();
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

  public joinWith(otherAction : PendingTurnActions) {
    for (let i = 0; i < otherAction.length; i++) {
      this.push(otherAction[i]);
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
  protected env : Env;
  /**
  * Object that owns action
  */
  protected owner : T;
  /**
  * This signal should be triggered after all action in run is done
  */
  protected onCompleteSignal : Phaser.Signal;

  constructor(env: Env, owner : T) {
    this.env             = env;
    this.owner            = owner;
    this.onCompleteSignal = new Phaser.Signal();
  }

  /**
  * Place animation logic for turn. It needs to trigger onCompleteSignal after everything is done
  */
  protected abstract performTurn() : void;

  /**
  * Description of current action using narration engine
  */
  public abstract turnDescription(narration : NarrationManager) : void;

  /**
  * Run action
  */
  public run() : Phaser.Signal {
    this.turnDescription(this.env.narration);
    this.performTurn();
    return this.onCompleteSignal;
  }
}
