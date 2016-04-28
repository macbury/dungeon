import Level from './level';
import DungeonScreen from './screens/dungeon_screen';
import MonstersManager from './monsters_manager';
import Player from './objects/player';

const PLAYER_MOVE_SOUND  = 'player_move';

/**
* This class contains all objects with information about current level env like Level, Monsters, Player etc
*/
export default class Env {
  /**
  * List of global sounds in game
  */
  public sounds       : {
    step : Phaser.Sound
  }
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

  constructor(screen : DungeonScreen) {
    this.screen         = screen;
    this.sounds         = {
      step: this.game.add.audio(PLAYER_MOVE_SOUND)
    }

    this.level           = new Level(this.screen, 'tileset', 100, 100);
    this.level.generate();
    this.level.setupPathFinding(this.screen.pathFinding);

    this.monsters        = new MonstersManager(this);
  }

  /**
  * Spawns new player
  */
  public spawnPlayer() {
    if (this.player != null) {
      throw "Player is already on map!!!";
    }
    this.player = new Player(this);
    this.player.position.set(16,16);
    this.player.follow(this.screen.camera);
    this.screen.gameObjectsLayer.add(this.player);
  }

  public static preload(load : Phaser.Loader) {
    load.audio(PLAYER_MOVE_SOUND, require('audio/snd_step.mp3'));
  }
}
