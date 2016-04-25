import GameObject from './game_object';
import { TILE_CENTER, GAME_OBJECT_FRAME_RATE } from '../consts';
import DungeonScreen from '../screens/dungeon_screen';
/**
* Monster object
*/
export default class Mob extends GameObject {
  private sprite : Phaser.Sprite;
  private idleAnimation : Phaser.Animation;

  constructor(screen : DungeonScreen, spriteKey: string, parent? : PIXI.DisplayObjectContainer) {
    super(screen, parent);
    this.sprite = this.game.add.sprite(TILE_CENTER, TILE_CENTER, spriteKey, null, this);
    this.sprite.anchor.set(0.5,0.5);
    this.sprite.autoCull = true;

    this.idleAnimation = this.sprite.animations.add('idle', [0, 1], GAME_OBJECT_FRAME_RATE, true);
    this.idleAnimation.play();
  }

  /**
  * Monster logic goes here.
  */
  public takeTurn() : Phaser.Tween {
    return null;
  }
}
