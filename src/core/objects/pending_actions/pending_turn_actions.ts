import GameObject from '../game_object';
import Env from '../../env';
import NarrationManager from '../../narration_manager';

/**
* This class helps creating all turn actions and iterate them
*/
export class TurnDirector {
  private actionsToPerform : Array<PendingTurnActions>;
  private singleActionsToPerform : Array<PendingTurnActions>;
  private parellActionsToPerform : PendingTurnActions;

  constructor() {
    this.clear();
    this.actionsToPerform = [];
  }

  /**
  * Reset pending actions arrays
  */
  public clear() {
    this.singleActionsToPerform = [];
    this.parellActionsToPerform = new PendingTurnActions();
  }

  /**
  * Create new turn and pops old actions to to turn queueu
  */
  public newTurn() : void {
    this.flush();
  }

  /**
  * Flush all staged actions
  */
  public finishTurn() : void {
    this.flush();
  }

  /**
  * Remove all parell actions for passed game object
  */
  public clearParellFor(gameObject : GameObject) : void {
    var tempAction : PendingTurnActions = new PendingTurnActions();
    var idsToRemove = [];
    for (let i = 0; i < this.parellActionsToPerform.length; i++) {
      var pendingAction : PendingTurnAction<GameObject> = this.parellActionsToPerform[i]
      if (pendingAction.owner !== gameObject) {
        tempAction.push(pendingAction);
      }
    }

    this.parellActionsToPerform = tempAction;
  }

  /**
  * Create new turn and pops old actions to to action queueu
  */
  public flush() : void {
    if (this.parellActionsToPerform.length > 0)
      this.actionsToPerform.push(this.parellActionsToPerform);
    for (let i = 0; i < this.singleActionsToPerform.length; i++) {
      this.actionsToPerform.push(this.singleActionsToPerform[i]);
    }
    this.clear();
  }

  /**
  * Return true if has next action to perform
  */
  public hasNext() : boolean {
    return this.actionsToPerform.length > 0;
  }

  /**
  * Pops next turn action and returns on complete callback
  */
  public runNext() : Phaser.Signal {
    var nextTurnAction : PendingTurnActions = this.actionsToPerform.splice(0,1)[0];
    return nextTurnAction.run();
  }

  /**
  * Creates single {PendingTurnActions} with pendingAction. It will be runned after parell actions
  */
  public addSingle(pendingAction : PendingTurnAction<GameObject>) : void {
    var pendingTurnActions = new PendingTurnActions();
    pendingTurnActions.push(pendingAction);
    this.singleActionsToPerform.push(pendingTurnActions);
  }

  /**
  * This actions will be runned in parell at beginning of turn
  */
  public addParell(pendingAction : PendingTurnAction<GameObject>) : void {
    this.parellActionsToPerform.push(pendingAction);
  }
}

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
  public owner : T;
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
  * Reference to game Phaser.GameObjectFactory
  */
  protected get add() : Phaser.GameObjectFactory {
    return this.env.game.add;
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
