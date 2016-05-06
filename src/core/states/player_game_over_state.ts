import BaseDungeonScreenState from './base_dungeon_screen_state';
/*
* This state displays game over screen to player
*/
export default class PlayerGameOverState extends BaseDungeonScreenState {

  public onEnter(payload : any)  : void {
    this.env.player.destroy();
  }
}
