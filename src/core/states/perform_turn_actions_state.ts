import BaseDungeonScreenState from './base_dungeon_screen_state';
import TurnStates from './turn_states';
import GameObject from '../objects/game_object';
import Mob from '../objects/mob';
import Character from '../objects/character';
import { TILE_SIZE, PLAYER_MOVE_SPEED } from '../consts';
import { IPlayerActionType } from './iplayer_action_type';
import { PendingTurnAction, PendingTurnActions } from '../objects/pending_actions/pending_turn_actions';
import { PendingPlayerMoveBlockedAction } from '../objects/pending_actions/pending_move_action';

/**
* Calculate all turn actions and then perform each one after one
*/
export default class PerformTurnActionsState extends BaseDungeonScreenState {
  private actionsToPerform : Array<PendingTurnActions>;
  /**
  * Checks what action did player choosed to perform
  */
  public onEnter(action : IPlayerActionType) {
    if (IPlayerActionType.isMovement(action)) {
      var playerPositionTile : Phaser.Point = new Phaser.Point();
      this.level.getTilePositionForGameObject(this.player, playerPositionTile);
      this.pathFinding.findPath(playerPositionTile, action.destination).addOnce(this.calculateActionsByPath, this);
      this.cursor.show();
    } else if (IPlayerActionType.isAttack(action)) {
      this.playerAttackMonsterAt(action.attackTarget);
    } else {
      throw "This is should not happen";
    }
  }

  private playerAttackMonsterAt(point : Phaser.Point) {
    this.actionsToPerform = [];
    var mob : Mob = this.monsters.getMonsterForTilePosition(point);
    if (mob == null) {
      throw "Could not find monster to attack";
    }

    var playerTurn : PendingTurnActions         = new PendingTurnActions();

    var playerAttack : PendingTurnAction<Mob | Character> = this.player.attack(mob, this.env);
    if (playerAttack == null) { // Mob out of range
      this.fsm.enter(TurnStates.PLAYER_CHOOSE_ACTION);
    } else { // Mob in range and attacked
      playerTurn.push(playerAttack);
      this.actionsToPerform.push(playerTurn);

      var mobTurn : PendingTurnActions = new PendingTurnActions();
      this.calculateMobsActions(mobTurn);
      this.actionsToPerform.push(mobTurn);
      this.runTurnActions();
    }

  }

  /**
  * Runs action for each visited tile in path of player
  */
  private calculateActionsByPath(path : Array<Phaser.Point>) {
    this.actionsToPerform = [];
    if (path == null) {// Cannot find path
      this.fsm.enter(TurnStates.PLAYER_CHOOSE_ACTION);
    } else {
      /**
      * Build pending actions for each calculated path
      */
      for (let i = 1; i < path.length; i++) {
        var turnAction       : PendingTurnActions      = new PendingTurnActions();
        var nextTilePosition : Phaser.Point            = path[i];

        /**
        * Move only if there is no monsters on next tile to move
        */
        if (!this.player.isPassable(nextTilePosition)) {
          // Something blocked our path so make pending action for it
          var playerBlockedAction : PendingPlayerMoveBlockedAction = new PendingPlayerMoveBlockedAction(this.env, this.player, nextTilePosition);
          turnAction.push(playerBlockedAction);
          this.actionsToPerform.push(turnAction);
          break;
        } else {
          var playerMoveTween  : PendingTurnAction<GameObject>  = this.player.move(nextTilePosition);
          turnAction.push(playerMoveTween);

          // agregate mob actions by type.
          // First find all actions for movement and add to current turn.
          // Recalculate fog of war. If new monster is stop path moving of player
          // Other actions like attack, healing should get separate actions and stop player movement.
          this.calculateMobsActions(turnAction);
          this.actionsToPerform.push(turnAction);
        }
      }
      this.runTurnActions();
    }
  }

  private calculateMobsActions(turnAction : PendingTurnActions) {
    for (let j = 0; j < this.monsters.length; j++) {
      var mobTurnTween : PendingTurnAction<GameObject>        = this.monsters.get(j).takeTurn();
      if (mobTurnTween != null) {
        turnAction.push(mobTurnTween);
      }
    }
  }

  // Iterate over each turnObject and perform its action. If all TurnObject did run then go to {PlayerChooseActionState}
  public runTurnActions() {
    if (this.actionsToPerform.length == 0) {
      this.fsm.enter(TurnStates.PLAYER_CHOOSE_ACTION);
    } else {
      var nextTurnAction : PendingTurnActions = this.actionsToPerform.splice(0,1)[0];
      nextTurnAction.run().addOnce(this.runTurnActions, this);
    }
  }

  public onExit() {
    // clear cache
    this.actionsToPerform = [];
    this.cursor.hide();
  }
}
