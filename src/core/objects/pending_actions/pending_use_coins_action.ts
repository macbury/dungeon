import { PendingTurnAction } from './pending_turn_actions';
import CollectableItem from '../collectable_item';
import NarrationManager from '../../narration_manager';
import Env from '../../env';
import GameObject from '../game_object';
import { TILE_SIZE, TILE_CENTER } from '../../consts';

/**
* This action shows coins emitter
*/
export default class PendingUseCoinsAction extends PendingTurnAction<GameObject> {
  private coins : number;

  constructor(env : Env, gameObject : GameObject, coins : number) {
    super(env, gameObject);
    this.coins = coins;
  }

  protected performTurn() : void {
    this.env.sprayCoins(this.coins, this.owner.tilePosition.x, this.owner.tilePosition.y);
    this.env.sounds.gold.onStop.addOnce(() => {
      this.onCompleteSignal.dispatch();
    });
    this.env.sounds.gold.play();
  }

  public turnDescription(narration : NarrationManager) : void {}
}
