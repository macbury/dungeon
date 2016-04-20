import BaseDungeonScreenState from './base_dungeon_screen_state';
import TurnStates from './turn_states';
import { TILE_SIZE } from '../consts';

/**
* In this state we animate player entity and move it to target position
*/
export default class PlayerMoveActionState extends BaseDungeonScreenState {
  private _tempTilePlayerPoint : Phaser.Point = new Phaser.Point();
  private _tempPlayerDirection : Phaser.Point = new Phaser.Point();
  private playerMoveTween      : Phaser.Tween;

  /**
  * Calculate direction in which player need to move
  */
  public onEnter(payload : { tilePos: Phaser.Point }) : void {
    if (payload.tilePos == null) {
      throw "Payload should contain target point";
    }

    this.level.getTilePositionForGameObject(this.player, this._tempTilePlayerPoint);
    this._tempPlayerDirection
          .set(payload.tilePos.x, payload.tilePos.y)
          .subtract(this._tempTilePlayerPoint.x, this._tempTilePlayerPoint.y)
          .normalize()
          .ceil()
          .multiply(TILE_SIZE, TILE_SIZE)
          .add(this.player.position.x, this.player.position.y);

    console.log("Works?", this._tempPlayerDirection);

    this.playerMoveTween = this.add.tween(this.player).to({
      x: this._tempPlayerDirection.x,
      y: this._tempPlayerDirection.y
    }, 250);

    this.playerMoveTween.onComplete.addOnce(this.onPlayerMoveComplete, this);
    this.playerMoveTween.start();
  }

  /**
  * Triggered by playerMoveTween
  */
  private onPlayerMoveComplete() : void {
    this.fsm.enter(TurnStates.PLAYER_CHOOSE_ACTION);
  }

}
