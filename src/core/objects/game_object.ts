import { TILE_SIZE, PLAYER_MOVE_SPEED } from '../consts';
import DungeonScreen from '../screens/dungeon_screen';
import Level from '../level';
import Player from './player';
import ObjectsGrid from '../objects_grid';
import MonstersManager from '../monsters_manager';
import Env from '../env';
import CharactersGrid from '../characters_grid';
import {TurnDirector} from './pending_actions/pending_turn_actions';
import Item from '../items/item';
/**
* Base class for all game objects in the game
*/
abstract class GameObject extends Phaser.Group {
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
  * Reference to characters managers
  */
  protected get characters() : CharactersGrid {
    return this.env.characters;
  }

  /**
  * Reference to item objects managers
  */
  protected get objects() : ObjectsGrid {
    return this.env.objects;
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

  /**
  * Name of character displayed in ui
  */
  public get name() {
    console.warn("Not implemented!");
    return "Implement this!";
  }

  /**
  * Description of character that will be displayed in ui
  */
  public get description() {
    console.warn("Not implemented!");
    return "Implement this!";
  }


}

export default GameObject;
