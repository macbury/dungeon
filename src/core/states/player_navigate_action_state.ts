import BaseDungeonScreenState from './base_dungeon_screen_state';
import TurnStates from './turn_states';

/**
* This state calculates path, and then switches to PLAYER_MOVE unitil player reach goal or is attacked by monster, or monster appears first time on screen
*/
export default class PlayerNavigateActionState extends BaseDungeonScreenState {
  private path : Array<Phaser.Point>;

  public onEnter(payload : { destination: Phaser.Point }) : void {
    // we got new path to follow so reset old one
    if (payload.destination != null) {
      this.path = null;
      this.rebuildPath(payload.destination);
    } else if (this.path == null) {
      throw "this should not happen"
    } else {
      this.goToNextPathElement();
    }
  }

  /**
  * Finds path to follow. If destination is not accessible returns to {PLAYER_CHOOSE_ACTION}, Otherwise go to next position
  */
  private rebuildPath(destination: Phaser.Point) {
    var playerPositionTile : Phaser.Point = new Phaser.Point();
    this.level.getTilePositionForGameObject(this.player, playerPositionTile);
    this.pathFinding.findPath(playerPositionTile, destination).addOnce(function(path : Array<Phaser.Point>) {
      //console.log("Path: ", path);
      this.path = path;
      this.goToNextPathElement();
    }, this);
  }

  private goToNextPathElement() : void {
    if (this.path == null || this.path.length == 0) {
      this.fsm.enter(TurnStates.PLAYER_CHOOSE_ACTION);
      this.path = null;
    } else {
      var nextTileToVisit : Phaser.Point = this.path.splice(0,1)[0];
      this.fsm.enter(TurnStates.PLAYER_MOVE, { destination: nextTileToVisit });
    }
  }
}
