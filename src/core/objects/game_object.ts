import { TILE_SIZE } from '../consts';
/**
* Base class for all game objects in the game
*/
export  default class GameObject extends Phaser.Group {
  /**
  * Preload assets here
  */
  public static preload(load : Phaser.Loader) : void {};

  /**
  * Set current position using tile position
  */
  public setTilePosition(x : number, y : number) {
    this.position.set(TILE_SIZE * x, TILE_SIZE * y);
  }
}
