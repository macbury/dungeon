import Item from './item';
import Env from '../env';
import { TurnDirector } from '../objects/pending_actions/pending_turn_actions';

const CORPSE_KEY = "CORPSE_KEY";
/**
* Pile of skeletons of died monster
*/
export default class Corpse extends Item {
  public getIconName() : string {
    return CORPSE_KEY;
  }

  public static preload(load : Phaser.Loader) : void {
    load.image(CORPSE_KEY, require('ui/corpse.png'));
  }

  public get name() {
    return `Corpse`;
  }

  public get description() {
    return "Undefined corpses. Maybe you should leave it";
  }

  public use(env : Env, turnDirector : TurnDirector) : void {
    //turnDirector.addSingle(new PendingUseCoinsAction(env, env.player, this.amount));
    console.warn("Implement this!!!");
  }
}
