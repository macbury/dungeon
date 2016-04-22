import GameObject from './game_object';
import { TILE_CENTER } from '../consts';
/**
* Monster object
*/
export default class Mob extends GameObject {
  private sprite : Phaser.Sprite;

  constructor(game : Phaser.Game, spriteKey: string, parent? : PIXI.DisplayObjectContainer) {
    super(game, parent, "monster");
    this.sprite = this.game.add.sprite(TILE_CENTER, TILE_CENTER, spriteKey, null, this);
    this.sprite.anchor.set(0.5,0.5);
    this.sprite.autoCull = true;
  }

}
