import BaseDungeonScreenState from './base_dungeon_screen_state';
import TurnStates from './turn_states';
import Mob from '../objects/mob';
/**
* In this state every monster on map runs it turn
*/
export default class MonstersActionState extends BaseDungeonScreenState {

  public onEnter() : void {
    //TODO check which monsters are visible or which will be visible
    //TODO quickly and dirty update all invisible monsters
    //TODO animate nicly all visible monsters
    //TODO go back to PLAYER_CHOOSE_ACTION

    var mob : Mob = this.monsters.create('dwarf');
    mob.position.set(32, 32);
  }

  public onUpdate(delta: number) {

    console.log("Run action for all monsters that are visible");
    this.fsm.enter(TurnStates.PLAYER_CHOOSE_ACTION);
  }

  public onExit() : void {

  }
}
