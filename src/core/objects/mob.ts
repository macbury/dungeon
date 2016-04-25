import GameObject from './game_object';
import { TILE_CENTER, GAME_OBJECT_FRAME_RATE } from '../consts';
/**
* Monster object
*/
export default class Mob extends GameObject {
  private sprite : Phaser.Sprite;
  private idleAnimation : Phaser.Animation;
  constructor(game : Phaser.Game, spriteKey: string, parent? : PIXI.DisplayObjectContainer) {
    super(game, parent, "monster");
    this.sprite = this.game.add.sprite(TILE_CENTER, TILE_CENTER, spriteKey, null, this);
    this.sprite.anchor.set(0.5,0.5);
    this.sprite.autoCull = true;

    this.idleAnimation = this.sprite.animations.add('idle', [0, 1], GAME_OBJECT_FRAME_RATE, true);
    this.idleAnimation.play();
  }

}
