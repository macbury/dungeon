import Character from './character';
import { TILE_CENTER, TILE_SIZE, GAME_OBJECT_FRAME_RATE, PLAYER_MOVE_SPEED } from '../consts';
import DungeonScreen from '../screens/dungeon_screen';
import { PendingPlayerMoveAction } from './pending_actions/pending_move_action';

const PLAYER_SPRITE_NAME = 'player_character';
const PLAYER_MOVE_SOUND  = 'player_move';
/**
* Main player class.
*/
export default class Player extends Character {
  private idleAnimation : Phaser.Animation;
  public stepSound       : Phaser.Sound;

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
  public move(target : Phaser.Point) : PendingPlayerMoveAction {
    this.virtualPosition.set(target.x, target.y);
    return new PendingPlayerMoveAction(this.game, this, target);
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
