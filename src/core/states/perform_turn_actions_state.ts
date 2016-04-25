import BaseDungeonScreenState from './base_dungeon_screen_state';
import TurnStates from './turn_states';

/**
* In this state every monster on map runs it turn
*/
export default class PerformTurnActionsState extends BaseDungeonScreenState {

  public onEnter(payload: any) {
    // If player did trigger movement
      // Calculate path for {Player}
      // For each position in patch for {Player} do
        // create TurnObject for each position
        // move player to position
        // update monster movement
        // check field of view
        // if new monster appeared then stop loop
        // if monster did not move and can attack then attack and stop loop
    // If player wants to attack entity
      // Create TurnObject
        // perform attack on monster
      // For each monster that can attack
        // create TurnObject
        // if can attack then perform attack
        // if wants to go to player then perform movement
        // if wants to escape then escape
  }

  public onUpdate(delta : number) {
    // Iterate over each turnObject and perform its action. If all TurnObject did run then go to {PlayerChooseActionState}
  }

  public onExit() {
    // clear cache
  }
}
