import Character from './character';
import GameObject from './game_object';
import { TILE_CENTER, GAME_OBJECT_FRAME_RATE, TILE_SIZE, PLAYER_MOVE_SPEED, MOVE_ARRAY } from '../consts';
import DungeonScreen from '../screens/dungeon_screen';
import { PendingTurnAction, TurnDirector } from './pending_actions/pending_turn_actions';
import { PendingMoveAction } from './pending_actions/pending_move_action';
import Env from '../env';
/**
* Monster object
*/
abstract class Mob extends Character {
  private idleAnimation : Phaser.Animation;

  constructor(env : Env, spriteKey: string, parent? : PIXI.DisplayObjectContainer) {
    super(env, parent);
    this.sprite = this.game.add.sprite(TILE_CENTER, TILE_CENTER, spriteKey, null, this);
    this.sprite.anchor.set(0.5,0.5);
    this.sprite.autoCull = true;

    this.idleAnimation = this.sprite.animations.add('idle', [0, 1], GAME_OBJECT_FRAME_RATE, true);
    this.idleAnimation.play();
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
}

export default Mob;
