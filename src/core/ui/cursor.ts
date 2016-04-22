import { Sprite } from 'phaser';
import { CURSOR_ANIMATION_SPEED } from '../consts';

/**
* Simple movement cursor
*/
export default class Cursor extends Sprite {
  constructor(game : Phaser.Game) {
    super(game, 0,0, 'cursor');
    this.visible = false;
    this.anchor.set(0.5, 0.5);
  }

  /**
  * Show cursor
  */
  public show() : void {
    if (!this.visible) {
      this.alpha   = 0.0;
      this.visible = true;
      this.scale.set(2,2);
      this.game.add.tween(this).to({ alpha: 1.0 }, CURSOR_ANIMATION_SPEED).start();
      this.game.add.tween(this.scale).to({ x: 1, y: 1 }, CURSOR_ANIMATION_SPEED).start();
    }
  }

  /**
  * Hide current cursor
  */
  public hide() : void {
    if (this.visible) {
      this.scale.set(1,1);
      this.alpha = 1;
      this.game.add.tween(this).to({ alpha: 0 }, CURSOR_ANIMATION_SPEED).start();
      this.game.add.tween(this.scale).to({ x: 0, y: 0 }, CURSOR_ANIMATION_SPEED).start().onComplete.addOnce(function() {
        this.visible = false;
      }, this);
    }
  }
}
