import ObjectItem from './object_item';
import Item from '../items/item';
import Env from '../env';
import { TILE_CENTER } from '../consts';
/**
* This game object display icon of dropped item on the floor. This game object can be collected.
* Characters can walk on collectable items
*/
export default class CollectableItem extends ObjectItem {
  /**
  * Sprite with item
  */
  public sprite : Phaser.Sprite;
  /**
  * Item that can be collected
  */
  public item : Item;
  constructor(env : Env, item : Item, parent? : PIXI.DisplayObjectContainer) {
    super(env, parent);
    this.item = item;
    this.sprite = this.game.add.sprite(TILE_CENTER, TILE_CENTER, item.getIconName(), null, this);
    this.sprite.anchor.set(0.5,0.5);
    this.sprite.autoCull = true;
  }

  public destroy(destroyChildren?: boolean, soft?: boolean) {
    super.destroy(destroyChildren, soft);
    this.item = null;
    this.objects.set(this.tilePosition.x, this.tilePosition.y, null);
  }

  /**
  * Name of character displayed in ui
  */
  public get name() {
    return this.item.name;
  }

  /**
  * Description of character that will be displayed in ui
  */
  public get description() {
    return this.item.description;
  }
}
