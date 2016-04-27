import Level from './level';
import DungeonScreen from './screens/dungeon_screen';
import MonstersManager from './monsters_manager';
import Player from './objects/player';
/**
* This class contains all objects with information about current level env like Level, Monsters, Player etc
*/
export default class Env {
  /**
  * Current map
  */
  public level        : Level;
  /**
  * Game screen
  */
  public screen       : DungeonScreen;
  /**
  * List of monsters in game
  */
  public monsters        : MonstersManager;
  /**
  * Current Player
  */
  public player          : Player;
  /**
  * Current game
  */
  public get game() : Phaser.Game {
    return this.screen.game;
  }
}
