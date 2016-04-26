import { TILE_SIZE, PLAYER_MOVE_SPEED } from '../consts';
import DungeonScreen from '../screens/dungeon_screen';
import Level from '../level';
import Player from './player';
import MonstersManager from '../monsters_manager';
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
  * Reference to monster managers
  */
  protected get monsters() : MonstersManager {
    return this.dungeonScreen.monsters;
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

  public set tilePosition(tilePos : Phaser.Point) {
    this.setTilePosition(tilePos.x,tilePos.y);
  }

  public get tilePosition() : Phaser.Point {
    return this.virtualPosition;
  }

}
