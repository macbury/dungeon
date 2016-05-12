import { PendingTurnAction } from './pending_turn_actions';
import CollectableItem from '../collectable_item';
import NarrationManager from '../../narration_manager';
import Env from '../../env';
import { TILE_SIZE, TILE_CENTER } from '../../consts';

/**
* This turn action hides CollectableItem and shows it as it pops from origin position
*/
export default class PendingDropAction extends PendingTurnAction<CollectableItem> {
  /**
  * From which tile it should appear
  */
  private origin : Phaser.Point;
  constructor(env : Env, owner : CollectableItem, origin : Phaser.Point) {
    super(env, owner);
    owner.visible = false;
    this.origin = origin;
  }

  protected performTurn() : void {
    this.owner.visible = true;
    this.owner.alpha   = 0.0;
    var tween : Phaser.Tween = this.add.tween(this.owner).to({
      alpha: 1.0,
      y: [this.owner.y - TILE_CENTER, this.owner.y, this.owner.y - TILE_CENTER / 2, this.owner.y]
    }, 200);

    tween.onComplete.addOnce(this.completeAction, this);

    tween.start();
  }


  public turnDescription(narration : NarrationManager) : void {}
}
