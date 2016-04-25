import Character from './character';
import { TILE_CENTER, TILE_SIZE, GAME_OBJECT_FRAME_RATE, PLAYER_MOVE_SPEED } from '../consts';
import DungeonScreen from '../screens/dungeon_screen';
import { TurnAction } from '../states/turn_actions';

const PLAYER_SPRITE_NAME = 'player_character';
const PLAYER_MOVE_SOUND  = 'player_move';
/**
* Main player class.
*/
export default class Player extends Character {
  private sprite : Phaser.Sprite;
  private idleAnimation : Phaser.Animation;
  private stepSound     : Phaser.Sound;

  constructor(screen : DungeonScreen, parent? : PIXI.DisplayObjectContainer) {
    super(screen, parent);
    this.sprite = this.game.add.sprite(TILE_CENTER, TILE_CENTER, PLAYER_SPRITE_NAME, null, this);
    this.sprite.anchor.set(0.5,0.5);

    this.idleAnimation = this.sprite.animations.add('idle', [0, 1], GAME_OBJECT_FRAME_RATE, true);
    this.idleAnimation.play();

    this.stepSound     = this.game.add.audio(PLAYER_MOVE_SOUND);
  }

  /**
  * Creates move action for {Player}
  * @param target - place to go on map in tile position
  */
  public move(target : Phaser.Point) : TurnAction {
    this.virtualPosition.set(target.x, target.y);

    return this.makeTurnAction(() : Phaser.Signal => {
      var moveTween : Phaser.Tween = this.game.make.tween(this);
      moveTween.to({
        x: target.x * TILE_SIZE,
        y: target.y * TILE_SIZE
      }, PLAYER_MOVE_SPEED);

      moveTween.onStart.addOnce(() => {
        this.stepSound.play();
      }, this)

      moveTween.start();
      return moveTween.onComplete;
    });
  }

  /**
  * Enable follow camera
  */
  public follow(camera : Phaser.Camera) {
    camera.follow(<any>this);
  }

  public static preload(load : Phaser.Loader) : void {
    load.spritesheet(PLAYER_SPRITE_NAME, require('player.png'), TILE_SIZE, TILE_SIZE);
    load.audio(PLAYER_MOVE_SOUND, require('audio/snd_step.mp3'));
  }
}
