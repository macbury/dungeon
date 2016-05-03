import BaseDungeonScreenState from './base_dungeon_screen_state';
import TurnStates from './turn_states';
import GameObject from '../objects/game_object';
import Mob from '../objects/mob';
import Character from '../objects/character';
import { TILE_SIZE, PLAYER_MOVE_SPEED } from '../consts';
import { IPlayerActionType } from './iplayer_action_type';
import { PendingTurnAction, PendingTurnActions, TurnDirector } from '../objects/pending_actions/pending_turn_actions';
import { PendingPlayerMoveBlockedAction, PendingPlayerMoveAction } from '../objects/pending_actions/pending_move_action';
import PendingAttackAction from '../objects/pending_actions/pending_attack_action';
/**
* Calculate all turn actions and then perform each one after one
*/
export default class PerformTurnActionsState extends BaseDungeonScreenState {
  private turnDirector : TurnDirector;

  constructor() {
    super();
    this.turnDirector = new TurnDirector();
  }

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
      //this.playerAttackMonsterAt(action.attackTarget);
      //this.cursor.show();
    } else {
      throw "This is should not happen";
    }
  }

  private playerAttackMonsterAt(point : Phaser.Point) {
    var mob : Mob = this.monsters.getMonsterForTilePosition(point);
    if (mob == null) {
      throw "Could not find monster to attack";
    }

    var playerAttack : PendingTurnAction<Mob | Character> = this.player.attack(mob, this.env);
    if (playerAttack == null) { // Mob out of range
      this.fsm.enter(TurnStates.PLAYER_CHOOSE_ACTION);
    } else { // Mob in range and attacked
      this.turnDirector.begin();
        this.playerTurnAction(playerAttack)
      this.turnDirector.end();

      this.runTurnActions();
    }
  }

  /**
  * Run action by player and then run actions by mobs
  * @return true if should stop next actions
  */
  private playerTurnAction(playerAction : PendingTurnAction<Mob | Character | GameObject>) : boolean {
    var moveTurnActions  : PendingTurnActions  = new PendingTurnActions();
    moveTurnActions.push(playerAction);
    this.turnDirector.addParell(playerAction);

    // agregate mob actions by type.
    // First find all actions for movement and add to current turn.
    // Recalculate fog of war. If new monster is stop path moving of player
    // Other actions like attack, healing should get separate actions and stop player movement.
    var blockNextActions = false;
    this.calculateMobsActions((parellAction : PendingTurnAction<GameObject>, singleAction : PendingTurnAction<GameObject>) => {
      if (parellAction != null) {
        moveTurnActions.push(parellAction);
      } else {
        var singleMobAction : PendingTurnActions  = new PendingTurnActions();
        singleMobAction.push(singleAction);
        //this.actionsToPerform.push(singleMobAction);
        blockNextActions = true;
      }
    });
    return blockNextActions;
  }

  /**
  * Runs action for each visited tile in path of player
  */
  private calculateActionsByPath(path : Array<Phaser.Point>) {
    if (path == null) {// Cannot find path
      this.fsm.enter(TurnStates.PLAYER_CHOOSE_ACTION);
    } else {
      /**
      * Build pending actions for each calculated path
      */
      for (let i = 1; i < path.length; i++) {
        this.turnDirector.begin();
        var nextTilePosition : Phaser.Point        = path[i];

        /**
        * Move only if there is no monsters on next tile to move
        */
        if (!this.player.isPassable(nextTilePosition)) {
          // Something blocked our path so make pending action for it
          var playerBlockedAction : PendingPlayerMoveBlockedAction = new PendingPlayerMoveBlockedAction(this.env, this.player, nextTilePosition);
          this.turnDirector.addParell(playerBlockedAction);
          this.turnDirector.end();
          break;
        } else {
          var playerMoveAction  : PendingTurnAction<GameObject>  = this.player.move(nextTilePosition);
          this.turnDirector.addParell(playerMoveAction);
          //if (this.playerTurnAction(playerMoveAction)) {
          //  break; // There was some type of attack or action that should stop next movement along the path
          //}
        }
        this.turnDirector.end();
      }

      this.runTurnActions();
    }
  }

  /**
  * Calculates next mob actions and separate them into two groups. moveTurnActions where only movoement actions are triggered, and attackTurnActions that are
  * runned in separate action after movement!
  */
  private calculateMobsActions(each: (parellAction : PendingTurnAction<GameObject>, singleAction : PendingTurnAction<GameObject>) => void) {
    for (let j = 0; j < this.monsters.length; j++) {
      var mobTurn : PendingTurnAction<GameObject> = this.monsters.get(j).takeTurn();
      if (mobTurn != null) { // Mob did something in this action
        if (mobTurn instanceof PendingAttackAction) { // Attacks should be done in separate turns
          each(null, mobTurn);
        } else {
          each(mobTurn, null);
        }
      }
    }
  }

  // Iterate over each turnObject and perform its action. If all TurnObject did run then go to {PlayerChooseActionState}
  public runTurnActions() {
    if (this.turnDirector.hasNext()) {
      this.turnDirector.runNext().addOnce(this.runTurnActions, this);
    } else {
      this.fsm.enter(TurnStates.PLAYER_CHOOSE_ACTION);

    }
  }

  public onExit() {
    // clear cache
    this.turnDirector.clear();
    this.cursor.hide();
  }
}
