import { TILE_SIZE, PLAYER_MOVE_SPEED, MOVE_ARRAY } from '../consts';
import DungeonScreen from '../screens/dungeon_screen';
import Level from '../level';
import Player from './player';
import { TurnAction } from '../states/turn_actions';
/**
* Base class for all game objects in the game
*/
export default class GameObject extends Phaser.Group {
  /**
  * Position used for calculating attacks, movement and other stuff that dont require to update {GameObject#position}
  */
  public virtualPosition : Phaser.Point = new Phaser.Point();
  private dungeonScreen : DungeonScreen;

  constructor(dungeonScreen : DungeonScreen, parent? : PIXI.DisplayObjectContainer) {
    super(dungeonScreen.game, parent);
    this.dungeonScreen = dungeonScreen;
  }

  /**
  * Reference to current level
  */
  protected get level() : Level {
    return this.dungeonScreen.level;
  }

  /**
  * Reference to current Player
  */
  protected get player() : Player {
    return this.dungeonScreen.player;
  }

  /**
  * Preload assets here
  */
  public static preload(load : Phaser.Loader) : void {};

  /**
  * Set current position using tile position
  */
  public setTilePosition(x : number, y : number) {
    this.position.set(TILE_SIZE * x, TILE_SIZE * y);
    this.virtualPosition.set(x, y);
  }

  /**
  * Small helper that helps creating turn actions
  */
  protected makeTurnAction(action : () => Phaser.Signal) : TurnAction {
    return new TurnAction(action);
  }

  /**
  * Creates move action for {GameObject}
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
      moveTween.start();
      return moveTween.onComplete;
    });
  }

  /**
  * Move in random position
  */
  public wander() : TurnAction {
    var tempPoint : Phaser.Point = new Phaser.Point();
    tempPoint.set(this.virtualPosition.x, this.virtualPosition.y);
    var dir : Phaser.Point       = Phaser.ArrayUtils.getRandomItem(MOVE_ARRAY, 0, MOVE_ARRAY.length);
    tempPoint.add(dir.x, dir.y);
    if (this.level.isPassable(tempPoint)) {
      return this.move(tempPoint);
    } else {
      return null;
    }
  }
}
