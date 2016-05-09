import Item from '../item';

const ICON_FILE = require('ui/minor_health_potion.png');
const KEY = "MINOR_HEALTH_KEY";

export default class MinorHealthPotion extends Item {
  public static preload(load : Phaser.Loader) : void {
    load.image(KEY, ICON_FILE);
  }

  public getIconName() : string {
    return KEY;
  }
}
