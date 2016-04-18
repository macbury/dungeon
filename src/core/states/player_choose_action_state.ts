import BaseState from '../fsm/base';
import DungeonScreen from '../screens/dungeon_screen';

export default class PlayerChooseActionState extends BaseState<DungeonScreen> {

  public onEnter() : void {
    console.log(" On enter ");
  }

  public onUpdate(delta: number) {
    //console.log(" on update ", delta);
  }

  public onExit() : void {
    console.log(" On exit ");
  }
}
