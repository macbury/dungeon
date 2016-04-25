import Character from './character';
import { TILE_CENTER, TILE_SIZE, GAME_OBJECT_FRAME_RATE } from '../consts';

const PLAYER_SPRITE_NAME = 'player';

/**
* Main player class.
*/
export default class Player extends Character {
  private sprite : Phaser.Sprite;
  private idleAnimation : Phaser.Animation;

  constructor(game : Phaser.Game, parent? : PIXI.DisplayObjectContainer) {
    super(game, parent, "player");
    this.sprite = this.game.add.sprite(TILE_CENTER, TILE_CENTER, PLAYER_SPRITE_NAME, null, this);
    this.sprite.anchor.set(0.5,0.5);

    this.idleAnimation = this.sprite.animations.add('idle', [0, 1], GAME_OBJECT_FRAME_RATE, true);
    this.idleAnimation.play();
  }

  /**
  * Enable follow camera
  */
  public follow(camera : Phaser.Camera) {
    camera.follow(<any>this);
  }

  public static preload(load : Phaser.Loader) : void {
    load.spritesheet(PLAYER_SPRITE_NAME, require('player.png'), TILE_SIZE, TILE_SIZE);
  }
}
