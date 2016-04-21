import BaseDungeonScreenState from './base_dungeon_screen_state';
import TurnStates from './turn_states';
import { TILE_SIZE, PLAYER_MOVE_SPEED } from '../consts';

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
  public onEnter(payload : { destination: Phaser.Point }) : void {
    if (payload.destination == null) {
      throw "Payload should contain target point";
    }

    /*this.level.getTilePositionForGameObject(this.player, this._tempTilePlayerPoint);

    this._tempPlayerDirection
          .set(payload.destination.x, payload.destination.y)
          .subtract(this._tempTilePlayerPoint.x, this._tempTilePlayerPoint.y)
          .normalize()
          .ceil()
          .multiply(TILE_SIZE, TILE_SIZE)
          .add(this.player.position.x, this.player.position.y);*/

    this.playerMoveTween = this.add.tween(this.player).to({
      x: payload.destination.x * TILE_SIZE,
      y: payload.destination.y * TILE_SIZE
    }, PLAYER_MOVE_SPEED);

    this.playerMoveTween.onComplete.addOnce(this.onPlayerMoveComplete, this);
    this.playerMoveTween.start();
  }

  /**
  * Triggered by playerMoveTween
  */
  private onPlayerMoveComplete() : void {
    this.fsm.enter(TurnStates.MONSTER_ACTION);
  }

}
