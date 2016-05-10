import Item from '../item';

const ICON_FILE = require('ui/minor_health_potion.png');
const KEY = "MINOR_HEALTH_KEY";

import Env from '../../env';
import {TurnDirector} from '../../objects/pending_actions/pending_turn_actions';

export default class MinorHealthPotion extends Item {
  public static preload(load : Phaser.Loader) : void {
    load.image(KEY, ICON_FILE);
  }

  public getIconName() : string {
    return KEY;
  }

  public get name() {
    return "Minor Health potion";
  }

  public get description() {
    return "Regenerates 30% of health";
  }

  public use(env : Env, turnDirector : TurnDirector) : void {
    console.warn("Implement using potions");
  }
}
