import Character from './character';
import { TILE_CENTER } from '../consts';

const PLAYER_SPRITE_NAME = 'knight';

/**
* Main player class.
*/
export default class Player extends Character {
  private sprite : Phaser.Sprite;

  constructor(game : Phaser.Game, parent? : PIXI.DisplayObjectContainer) {
    super(game, parent, "player");
    this.sprite = this.game.add.sprite(TILE_CENTER, TILE_CENTER, PLAYER_SPRITE_NAME, null, this);
    this.sprite.anchor.set(0.5,0.5);
  }

  /**
  * Enable follow camera
  */
  public follow(camera : Phaser.Camera) {
    camera.follow(<any>this);
  }

  public static preload(load : Phaser.Loader) : void {
    load.image(PLAYER_SPRITE_NAME, require('knight2.png'));
  }
}
