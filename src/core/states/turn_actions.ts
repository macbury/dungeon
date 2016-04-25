/**
* Simple wrapper around array that contains {TurnAction}
*/
export class TurnActions extends Array<TurnAction> {
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
      var action : TurnAction = this[i];
      action.run().addOnce(this.onActionComplete, this);
    }

    return this.onComplete;
  }
}

/**
* Simple wrapper around action. This can be runned in parell with other actions!
*/
export class TurnAction {
  private _callback: () => Phaser.Signal;

  constructor(action: () => Phaser.Signal) {
    this._callback = action;
  }

  run() : Phaser.Signal {
    return this._callback();
  }
}
