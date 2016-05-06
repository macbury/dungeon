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
      this.playerAttackMonsterAction(action.attackTarget);
      this.cursor.show();
      this.runTurnActions();
    } else {
      throw "This is should not happen";
    }
  }

  /**
  * Move player to specified location and run all actions for monsters.
  * @return true if should break path building action because blocked road or monster attack
  */
  private playerMoveAction(nextTilePosition : Phaser.Point) : boolean {
    var shouldBreak : boolean = false;
    this.turnDirector.newTurn(); {
      if (this.player.move(nextTilePosition, this.turnDirector)) {
        shouldBreak = this.calculateRestOfActions();
      } else {
        shouldBreak = true;
      }
    } this.turnDirector.finishTurn();

    return shouldBreak;
  }

  /**
  * Attack monster at location and calculate monster actions
  */
  private playerAttackMonsterAction(point : Phaser.Point) {
    var mob : Mob = this.monsters.getMonsterForTilePosition(point);
    if (mob == null) {
      throw "Could not find monster to attack";
    }

    this.turnDirector.newTurn(); {
      this.player.attack(mob, this.env, this.turnDirector);
      this.calculateRestOfActions();
    } this.turnDirector.finishTurn();
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
        var nextTilePosition : Phaser.Point        = path[i];
        if (this.playerMoveAction(nextTilePosition)) {
          break;
        }
      }

      this.runTurnActions();
    }
  }

  /**
  * Calculates next mob actions and separate them into two groups. moveTurnActions where only movoement actions are triggered, and attackTurnActions that are
  * runned in separate action after movement!
  * @return true if did perform action that should break building path
  */
  private calculateRestOfActions() : boolean {
    var turnShouldStop : boolean = false;

    if (this.player.afterTurn(this.turnDirector)) {
      return false;
    }

    for (let j = 0; j < this.monsters.length; j++) {
      var mob : Mob = this.monsters.get(j);

      if (mob.health.isAlive()) {
        if (mob.takeTurn(this.turnDirector)) {
          turnShouldStop = true;
        }
      }

      if (mob.afterTurn(this.turnDirector)) {
        turnShouldStop = true;
      }
    }

    return turnShouldStop;
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
