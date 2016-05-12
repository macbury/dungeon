import BaseDungeonScreenState from './base_dungeon_screen_state';
import TurnStates from './turn_states';
import { TILE_SIZE, CURSOR_ANIMATION_SPEED, TILE_CENTER } from '../consts';
import { IPlayerActionType } from './iplayer_action_type';
/**
* In this state player can select its action like attack, defense, sleep or interaction with any object on map
*/
export default class PlayerChooseActionState extends BaseDungeonScreenState {

  public onEnter(payload : { spottedMonster: boolean }) : void {
    this.input.onTap.add(this.onPlayerTap, this);
  }

  public onExit() : void {
    this.input.onTap.remove(this.onPlayerTap, this);
  }

  /**
  * In here we check where player did tap on map
  **/
  private onPlayerTap(pointer : Phaser.Pointer, doubleTap : boolean) : void {
    let tapTile : Phaser.Point    = this.map.getTilePositionFor(pointer);

    this.cursor.position.set(tapTile.x * TILE_SIZE + TILE_CENTER, tapTile.y * TILE_SIZE + TILE_CENTER);

    let playerAction : IPlayerActionType = null;

    if (this.player.tilePosition.equals(tapTile)) {
      playerAction = IPlayerActionType.pick();
    } else if (this.monsters.isOnTile(tapTile)) {// is monster
      playerAction = IPlayerActionType.performMeleeAttack(tapTile);
    } else if (this.map.isPassable(tapTile)) {
      playerAction = IPlayerActionType.performMoveTo(tapTile);
    }

    if (playerAction != null) {
      this.fsm.enter(TurnStates.PERFORM_TURN_ACTIONS, playerAction);
    }
  }
}
