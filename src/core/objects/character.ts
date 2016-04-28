import GameObject from './game_object';
import { PendingMoveAction } from './pending_actions/pending_move_action';
import Env from '../env';
/**
* Base class for {Player} or {Mob} characters. Character can move, has animated sprite, and can be killed.
*/
export default class Character extends GameObject {
  /**
  * Sprite with character
  */
  public sprite : Phaser.Sprite;
  /**
  * Direction in which character is facing
  */
  public direction : Phaser.Point;

  constructor(env : Env, parent? : PIXI.DisplayObjectContainer) {
    super(env, parent);
    this.direction = new Phaser.Point();
  }

  /**
  * Returns true if passed tile position is passable
  */
  public isPassable(otherTilePoint : Phaser.Point) : boolean {
    return this.level.isPassable(otherTilePoint) && !this.monsters.isOnTile(otherTilePoint) && !this.player.tilePosition.equals(otherTilePoint);
  }

  /**
  * Updates player tilePosition to specified in parameter and updates direction sprite is facing using direction
  * @param target - place to go on map in tile position
  */
  public move(target : Phaser.Point) : PendingMoveAction {
    this.direction.set(target.x, target.y)
                  .subtract(this.tilePosition.x, this.tilePosition.y)
                  .normalize();
    this.virtualPosition.set(target.x, target.y);
    return null;
  }

  /**
  * Flips sprite to make it look that is facing { direction }. Run automatically in update method
  */
  protected updateSpriteFacingByDirection() {
    if (this.direction.x == 1 || this.direction.y == 1) {
      this.sprite.scale.set(-1, 1);
    } else {
      this.sprite.scale.set(1, 1);
    }
  }

  public update() {
    this.updateSpriteFacingByDirection();
    super.update();
  }
}
