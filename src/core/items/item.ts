
/**
* Base class for all items in game
*/
abstract class Item {
  protected game : Phaser.Game;

  constructor(game : Phaser.Game) {
    this.game = game;
  }

  /**
  * Returns item icon name for texture
  */
  public abstract getIconName() : string;

  /**
  * Returns texture assigned with item
  */
  public getIconImage() : PIXI.BaseTexture {
    return this.game.cache.getBaseTexture(this.getIconName());
  }
  /**
  * Preload assets here
  */
  public static preload(load : Phaser.Loader) : void {};
}

export default Item;
