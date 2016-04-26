import GameObject from './game_object';
import { TILE_CENTER, GAME_OBJECT_FRAME_RATE, TILE_SIZE, PLAYER_MOVE_SPEED, MOVE_ARRAY } from '../consts';
import DungeonScreen from '../screens/dungeon_screen';
import { PendingTurnAction, PendingMoveAction } from '../states/turn_actions';
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
  public takeTurn() : PendingTurnAction<GameObject> {
    return null;
  }

  /**
  * Creates move action for {GameObject}
  * @param target - place to go on map in tile position
  */
  public move(target : Phaser.Point) : PendingMoveAction {
    this.virtualPosition.set(target.x, target.y);
    return new PendingMoveAction(this.game, this, target);
  }

  /**
  * Move Mob in random position that is passable and not occupied by another monster
  */
  public wander() : PendingMoveAction {
    var nextTilePos : Phaser.Point = new Phaser.Point();
    nextTilePos.set(this.virtualPosition.x, this.virtualPosition.y);
    var dir : Phaser.Point       = Phaser.ArrayUtils.getRandomItem(MOVE_ARRAY, 0, MOVE_ARRAY.length);
    nextTilePos.add(dir.x, dir.y);
    if (this.level.isPassable(nextTilePos) && !this.monsters.isOnTile(nextTilePos) && !this.player.tilePosition.equals(nextTilePos)) {
      return this.move(nextTilePos);
    } else {
      return null;
    }
  }
}
