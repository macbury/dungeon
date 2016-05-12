import Character from './character';
import GameObject from './game_object';
import { TILE_CENTER, GAME_OBJECT_FRAME_RATE, TILE_SIZE, PLAYER_MOVE_SPEED, MOVE_ARRAY, DEATH_FRAME_RATE } from '../consts';
import DungeonScreen from '../screens/dungeon_screen';
import { PendingTurnAction, TurnDirector } from './pending_actions/pending_turn_actions';
import { PendingMoveAction } from './pending_actions/pending_move_action';
import Env from '../env';
import MobHealthBar from '../ui/mob_health_bar';
import {Stats} from '../rpg/stats';
const HEALTH_BAR_OFFSET : number = -4;
const MAX_DISTANCE_TO_SEE_MONSTER_HP : number = 3;
const DEATH_SPRITESHEET : string = 'DEATH_SPRITESHEET';
/**
* Monster object
*/
abstract class Mob extends Character {
  public idleAnimation : Phaser.Animation;
  public deathAnimation : Phaser.Animation;
  private healthBar     : MobHealthBar;
  public deathSprite : Phaser.Sprite;

  constructor(env : Env, spriteKey: string, parent? : PIXI.DisplayObjectContainer) {
    super(env, parent);
    this.sprite      = this.game.add.sprite(TILE_CENTER, TILE_CENTER, spriteKey, null, this);
    this.sprite.anchor.set(0.5,0.5);
    this.sprite.autoCull = true;

    this.deathSprite = this.game.add.sprite(TILE_CENTER, TILE_CENTER, DEATH_SPRITESHEET, null, this);
    this.deathSprite.anchor.set(0.5,0.5);
    this.deathSprite.visible  = false;


    this.deathAnimation = this.deathSprite.animations.add('idle', [0, 1, 2, 3, 4], DEATH_FRAME_RATE, true);
    this.idleAnimation  = this.sprite.animations.add('idle', [0, 1], GAME_OBJECT_FRAME_RATE, true);
    this.idleAnimation.play();
    this.deathAnimation.play();
    this.healthBar     = new MobHealthBar(this.game, this.health);
    this.healthBar.y   = HEALTH_BAR_OFFSET;
    this.add(this.healthBar);
  }

  /**
  * Monster logic goes here.
  * @return true if did perform action that requires to stop building few turns at once
  */
  public abstract takeTurn(turnDirector : TurnDirector) : boolean;

  /**
  * Creates move action for {GameObject}
  * @param target - place to go on map in tile position
  */
  public move(target : Phaser.Point, turnDirector : TurnDirector) : boolean {
    if (super.move(target, turnDirector)) {
      turnDirector.addParell(new PendingMoveAction(this.env, this, target));
      return true;
    } else {
      return false;
    }
  }

  public update() {
    super.update();

    // If monster is visible and is near player or it was hit show its health bar
    if (this.visible) {
      this.healthBar.visible = (this.distance(this.env.player) <= MAX_DISTANCE_TO_SEE_MONSTER_HP || this.health.isNotMax());
    }
  }

  /**
  * Move Mob in random position that is passable and not occupied by another monster
  */
  public wander(turnDirector : TurnDirector) : void {
    var nextTilePos : Phaser.Point = new Phaser.Point();
    nextTilePos.set(this.virtualPosition.x, this.virtualPosition.y);
    var dir : Phaser.Point       = Phaser.ArrayUtils.getRandomItem(MOVE_ARRAY, 0, MOVE_ARRAY.length);
    nextTilePos.add(dir.x, dir.y);
    this.move(nextTilePos, turnDirector);
  }

  public die(turnDirector : TurnDirector) {
    super.die(turnDirector);
    this.monsters.remove(this);
    //todo add drop stuff here
  }

  public static preload(load : Phaser.Loader) {
    load.spritesheet(DEATH_SPRITESHEET, require('effects/death.png'), 24, 24);
  }
}

export default Mob;
