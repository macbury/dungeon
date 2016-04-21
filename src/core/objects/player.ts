import Character from './character';
import { TILE_CENTER } from '../consts';
export default class Player extends Character {
  private sprite : Phaser.Sprite;

constructor(game : Phaser.Game, spriteKey: string, parent? : PIXI.DisplayObjectContainer) {
    super(game, parent, "player");
    this.sprite = this.game.add.sprite(TILE_CENTER, TILE_CENTER, spriteKey, null, this);
    this.sprite.anchor.set(0.5,0.5);
  }

  /**
  * Enable follow camera
  */
  public follow(camera : Phaser.Camera) {
    camera.follow(<any>this);
  }
}
