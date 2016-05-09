import Level from './level';
import DungeonScreen from './screens/dungeon_screen';
import MonstersManager from './monsters_manager';
import CharactersGrid from './characters_grid';
import Ant from './objects/monsters/ant';
import Slime from './objects/monsters/slime';
import Player from './objects/player';
import NarrationManager from './narration_manager';
import ObjectsGrid from './objects_grid';
import {TurnDirector} from './objects/pending_actions/pending_turn_actions';
import { CollectableItem, Item } from './items/items';
import { AROUND } from './consts';
import PendingDropAction from './objects/pending_actions/pending_drop_action';

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
  * List of all chests, dropped items etc in level
  */
  public objects      : ObjectsGrid;

  /**
  * List of all monsters and npcs and player in level
  */
  public characters      : CharactersGrid;


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
    this.characters      = new CharactersGrid(this.level);
    this.objects         = new ObjectsGrid(this.level);
    this.monsters        = new MonstersManager(this);
    this.narration       = new NarrationManager(this);
  }

  /**
  * Drop item on floor around origin tile
  * @param origin in tile position
  * @param item that will be dropped
  * @param turnDirector to insert turn action of drop
  * @return true if there was place to drop this item
  */
  public drop(origin : Phaser.Point, item : Item, turnDirector : TurnDirector) : boolean {
    let cursor : Phaser.Point = new Phaser.Point();

    for (let i = 0; i < AROUND.length; i++) {
      cursor.set(AROUND[i].x, AROUND[i].y).add(origin.x, origin.y);

      if (this.level.isPassable(cursor) && this.objects.isEmpty(cursor.x, cursor.y)) {
        let collectableItem : CollectableItem = new CollectableItem(this, item);
        collectableItem.setTilePosition(cursor.x, cursor.y);
        this.screen.itemsLayer.add(collectableItem);
        turnDirector.addParell(new PendingDropAction(this, collectableItem, origin));
        return true;
      }
    }

    return false;
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
    this.level.update();
  }

  public static preload(load : Phaser.Loader) {
    load.audio(HIT_SOUND,  require('audio/snd_hit.mp3'));
    load.audio(MOVE_SOUND, require('audio/snd_step.mp3'));
    load.audio(MOVE_BLOCKED_SOUND, require('audio/snd_step_block.mp3'));
  }
}
