import BaseDungeonScreenState from './base_dungeon_screen_state';
import TurnStates from './turn_states';
import GameObject from '../objects/game_object';
import { TILE_SIZE, PLAYER_MOVE_SPEED } from '../consts';
import { IPlayerActionType } from './iplayer_action_type';
import { PendingTurnAction, TurnActions } from './turn_actions';


/**
* Calculate all turn actions and then perform each one after one
*/
export default class PerformTurnActionsState extends BaseDungeonScreenState {
  private actionsToPerform : Array<TurnActions>;
  /**
  * Checks what action did player choosed to perform
  */
  public onEnter(action : IPlayerActionType) {
    if (IPlayerActionType.isMovement(action)) {
      var playerPositionTile : Phaser.Point = new Phaser.Point();
      this.level.getTilePositionForGameObject(this.player, playerPositionTile);
      this.pathFinding.findPath(playerPositionTile, action.destination).addOnce(this.calculateActionsByPath, this);
      this.cursor.show();
    }
  }

  /** If player did trigger movement
    // Calculate path for {Player}
    // For each position in patch for {Player} do
      // if position is unreachable
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
  **/
  private calculateActionsByPath(path : Array<Phaser.Point>) {
    this.actionsToPerform = [];
    if (path == null) {// Cannot find path
      this.fsm.enter(TurnStates.PLAYER_CHOOSE_ACTION);
    } else {
      for (let i = 1; i < path.length; i++) {
        var turnAction       : TurnActions      = new TurnActions();
        var nextTilePosition : Phaser.Point     = path[i];

        /**
        * Move only if there is no monsters on next tile to move
        */
        if (this.monsters.isOnTile(nextTilePosition)) {
          break;
        } else {
          var playerMoveTween  : PendingTurnAction<GameObject>  = this.player.move(nextTilePosition);
          turnAction.push(playerMoveTween);

          for (let j = 0; j < this.monsters.length; j++) {
            var mobTurnTween : PendingTurnAction<GameObject>        = this.monsters.get(j).takeTurn();
            if (mobTurnTween != null) {
              turnAction.push(mobTurnTween);
            }
          }
          this.actionsToPerform.push(turnAction);
        }
      }
      this.runTurnActions();
    }
  }

  // Iterate over each turnObject and perform its action. If all TurnObject did run then go to {PlayerChooseActionState}
  public runTurnActions() {
    if (this.actionsToPerform.length == 0) {
      this.fsm.enter(TurnStates.PLAYER_CHOOSE_ACTION);
    } else {
      var nextTurnAction : TurnActions = this.actionsToPerform.splice(0,1)[0];
      nextTurnAction.run().addOnce(this.runTurnActions, this);
    }
  }

  public onExit() {
    // clear cache
    this.actionsToPerform = [];
    this.cursor.hide();
  }
}
