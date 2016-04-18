import FSM from './fsm';

/*
* Base state class used by StateMachine
*/
export default class Base<T> {
  private stateMachine: FSM<T>;

  /**
  * Setups state to be used with state machine
  */
  public setup(stateMachine: FSM<T>) {
    if (this.stateMachine == null) {
      this.stateMachine = stateMachine;
    }
  }

  /**
  * current context
  */
  protected get context() : T {
    return this.stateMachine.context;
  }

  public onEnter()  : void {};
  public onUpdate(delta : number)  : void {};
  public onExit()   : void {};
}
