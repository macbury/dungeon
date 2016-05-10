import Item from './item';

const GOLD_ICON_FILE = require('ui/gold.png');
const GOLD_KEY = "GOLD_KEY";
/**
* Main currency in game
*/
export default class Gold extends Item {
  private amount : number;
  constructor(game : Phaser.Game, amount : number) {
    super(game);
    this.amount = amount;
  }

  public getIconName() : string {
    return GOLD_KEY;
  }

  public static preload(load : Phaser.Loader) : void {
    load.image(GOLD_KEY, GOLD_ICON_FILE);
  }

  public get name() {
    return `${this.amount} gold`;
  }

  public get description() {
    return "Shiny gold coins";
  }
}
