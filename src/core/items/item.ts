/**
* Base class for all items in game
*/
export default class Item {
  protected game : Phaser.Game;

  constructor(game : Phaser.Game) {
    this.game = game;
  }

  /**
  * Preload assets here
  */
  public static preload(load : Phaser.Loader) : void {};
}
