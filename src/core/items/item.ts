
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
  * Name of character displayed in ui
  */
  public get name() {
    console.warn("Implement name getter for this item");
    return "This item dont have name";
  }

  /**
  * Description of character that will be displayed in ui
  */
  public get description() {
    console.warn("Implement description getter for this item");
    return "This item dont have description";
  }

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
