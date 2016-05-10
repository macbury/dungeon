import Item from './item';
import { TurnDirector } from '../objects/pending_actions/pending_turn_actions';
import Env from '../env';
import PendingUseCoinsAction from '../objects/pending_actions/pending_use_coins_action';
const GOLD_KEY = "GOLD_KEY";

/**
* Main currency in game
*/
export default class Gold extends Item {
  private amount : number;
  constructor(game : Phaser.Game, amount : number) {
    super(game);
    this.amount = amount;
    this.consumeOnPick = true;
  }

  public getIconName() : string {
    return GOLD_KEY;
  }

  public static preload(load : Phaser.Loader) : void {
    load.image(GOLD_KEY, require('ui/gold.png'));
  }

  public get name() {
    return `${this.amount} gold`;
  }

  public get description() {
    return "A pile of gold coins. Collect them to spend them later in a shop.";
  }

  public use(env : Env, turnDirector : TurnDirector) : void {
    turnDirector.addSingle(new PendingUseCoinsAction(env, env.player, this.amount));
    console.warn("This should add gold to player inventory");
  }
}
