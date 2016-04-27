import GameObject from './game_object';

/**
* Base class for {Player} or {Mob} characters
*/
export default class Character extends GameObject {
  public sprite : Phaser.Sprite;

  /**
  * Returns true if passed tile position is passable
  */
  public isPassable(otherTilePoint : Phaser.Point) : boolean {
    return this.level.isPassable(otherTilePoint) && !this.monsters.isOnTile(otherTilePoint) && !this.player.tilePosition.equals(otherTilePoint);
  }
}
