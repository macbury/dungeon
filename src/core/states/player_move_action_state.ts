import BaseDungeonScreenState from './base_dungeon_screen_state';

/**
* In this state we animate player entity and move it to target position
*/
export default class PlayerMoveActionState extends BaseDungeonScreenState {

  public onEnter(payload : { point: Phaser.Point }) : void {
    if (payload.point == null) {
      throw "Payload should contain target point";
    }

    
    console.log("Works?", payload.point);
  }
}
