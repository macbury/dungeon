import { TILE_SIZE, PLAYER_MOVE_SPEED } from '../consts';
import DungeonScreen from '../screens/dungeon_screen';
import Level from '../level';
import Player from './player';
import MonstersManager from '../monsters_manager';
import Env from '../env';
/**
* Base class for all game objects in the game
*/
export default class GameObject extends Phaser.Group {
  /**
  * Position used for calculating attacks, movement and other stuff that dont require to update {GameObject#position}
  */
  public virtualPosition : Phaser.Point = new Phaser.Point();
  /**
  * Current level env
  */
  protected env : Env;

  constructor(env : Env, parent? : PIXI.DisplayObjectContainer) {
    super(env.game, parent);
    this.env = env;
  }

  /**
  * Reference to current level
  */
  protected get level() : Level {
    return this.env.level;
  }

  /**
  * Reference to monster managers
  */
  protected get monsters() : MonstersManager {
    return this.env.monsters;
  }

  /**
  * Reference to current Player
  */
  protected get player() : Player {
    return this.env.player;
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
