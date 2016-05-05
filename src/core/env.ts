import Level from './level';
import DungeonScreen from './screens/dungeon_screen';
import MonstersManager from './monsters_manager';
import Player from './objects/player';
import NarrationManager from './narration_manager';

const MOVE_SOUND  = 'MOVE_SOUND';
const MOVE_BLOCKED_SOUND  = 'MOVE_BLOCKED_SOUND';
const HIT_SOUND   = 'HIT_SOUND';
/**
* This class contains all objects with information about current level env like Level, Monsters, Player etc
*/
export default class Env {

  /**
  * Reference to narration engine
  */
  public narration : NarrationManager;

  /**
  * List of global sounds in game
  */
  public sounds       : {
    step :     Phaser.Sound,
    hit:       Phaser.Sound,
    stepBlock: Phaser.Sound
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
      step: this.game.add.audio(MOVE_SOUND),
      hit: this.game.add.audio(HIT_SOUND),
      stepBlock: this.game.add.audio(MOVE_BLOCKED_SOUND)
    }

    this.level           = new Level(this.screen, 'tileset', 100, 100);
    this.level.generate();
    this.level.setupPathFinding(this.screen.pathFinding);

    this.monsters        = new MonstersManager(this);
    this.narration       = new NarrationManager(this);
  }

  /**
  * Spawns new player
  */
  public spawnPlayer() {
    if (this.player != null) {
      throw "Player is already on map!!!";
    }
    this.player = new Player(this);
    this.player.setTilePosition(1,1);
    this.player.follow(this.screen.camera);
    this.screen.gameObjectsLayer.add(this.player);
  }

  public update() {

  }

  public static preload(load : Phaser.Loader) {
    load.audio(HIT_SOUND,  require('audio/snd_hit.mp3'));
    load.audio(MOVE_SOUND, require('audio/snd_step.mp3'));
    load.audio(MOVE_BLOCKED_SOUND, require('audio/snd_step_block.mp3'));
  }
}
