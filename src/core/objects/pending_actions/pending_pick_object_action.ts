import { PendingTurnAction } from './pending_turn_actions';
import CollectableItem from '../collectable_item';
import NarrationManager from '../../narration_manager';
import Env from '../../env';
import { TILE_SIZE, TILE_CENTER } from '../../consts';

/**
* This turn action shows animation of picking item by player
*/
export default class PendingPickObjectAction extends PendingTurnAction<CollectableItem> {
  constructor(env : Env, owner : CollectableItem) {
    super(env, owner);
  }

  protected performTurn() : void {
    this.owner.visible = true;
    this.owner.alpha   = 0.0;
    this.env.screen.world.add(this.owner);
    var tween : Phaser.Tween = this.add.tween(this.owner).to({
      alpha: 1.0,
      y: [this.owner.y - TILE_CENTER, this.owner.y, this.owner.y - TILE_CENTER / 2, this.owner.y]
    }, 400);
    this.env.sounds.pickItem.play();
    tween.onComplete.addOnce(() => {
      this.owner.destroy();
      this.completeAction();
    });

    tween.start();
  }

  public turnDescription(narration : NarrationManager) : void {
    narration.info(`You have picked: ${this.owner.name}`)
  }
}
