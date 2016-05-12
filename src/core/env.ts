import Map from './map';
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
import { AROUND, TILE_SIZE, TILE_CENTER } from './consts';
import PendingDropAction from './objects/pending_actions/pending_drop_action';
import { InventoryManager } from './inventory_manager';

const MOVE_SOUND  = 'MOVE_SOUND';
const MOVE_BLOCKED_SOUND  = 'MOVE_BLOCKED_SOUND';
const HIT_SOUND   = 'HIT_SOUND';
const MISS_SOUND   = 'MISS_SOUND';
const GOLD_SOUND   = 'GOLD_SOUND';
const DEATH_SOUND   = 'DEATH_SOUND';
const PICK_ITEM_SOUND   = 'PICK_ITEM_SOUND';
const COIN_KEY = "COIN_KEY";

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
    stepBlock: Phaser.Sound,
    miss:     Phaser.Sound,
    gold:     Phaser.Sound,
    pickItem  : Phaser.Sound,
    death: Phaser.Sound
  }
  /**
  * Current map
  */
  public map          : Map;
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
  * List of items that player have
  */
  public inventory       : InventoryManager;

  /**
  * List of all chests, dropped items etc in level
  */
  public objects      : ObjectsGrid;

  /**
  * List of all monsters and npcs and player in level
  */
  public characters      : CharactersGrid;

  /**
  * Current floor that player occupies. Higher floor makes monster more powerfull
  */
  public floor : number;

  private coinEmitter     : Phaser.Particles.Arcade.Emitter;

  /**
  * Current game
  */
  public get game() : Phaser.Game {
    return this.screen.game;
  }

  constructor(screen : DungeonScreen) {
    this.floor          = 1;
    this.screen         = screen;
    this.sounds         = {
      step: this.game.add.audio(MOVE_SOUND),
      hit: this.game.add.audio(HIT_SOUND),
      stepBlock: this.game.add.audio(MOVE_BLOCKED_SOUND),
      miss: this.game.add.audio(MISS_SOUND),
      gold: this.game.add.audio(GOLD_SOUND),
      pickItem: this.game.add.audio(PICK_ITEM_SOUND),
      death: this.game.add.audio(DEATH_SOUND)
    }

    this.map           = new Map(this.screen, 'tileset', 100, 100);
    this.map.generate();
    this.map.setupPathFinding(this.screen.pathFinding);
    this.characters      = new CharactersGrid(this.map);
    this.objects         = new ObjectsGrid(this.map);
    this.monsters        = new MonstersManager(this);
    this.narration       = new NarrationManager(this);
    this.inventory       = new InventoryManager();

    this.coinEmitter     = this.game.add.emitter(0,0, 100);
    this.coinEmitter.makeParticles(COIN_KEY);
    this.coinEmitter.gravity = 200;
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

      if (this.map.isPassable(cursor) && this.objects.isEmpty(cursor.x, cursor.y)) {
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
  * Spray coins at location
  * @param number of coins to spray
  * @param tile position
  */
  public sprayCoins(coins : number, x : number, y : number) : void {
    this.coinEmitter.x = x * TILE_SIZE + TILE_CENTER;
    this.coinEmitter.y = y * TILE_SIZE + TILE_CENTER;
    this.coinEmitter.start(true, 500, null, Math.floor(coins / 2 + 2));
    this.game.world.bringToTop(this.coinEmitter);
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
    this.map.update();
  }

  public static preload(load : Phaser.Loader) {
    load.image(COIN_KEY, require('ui/coin.png'));
    load.audio(HIT_SOUND,  require('audio/snd_hit.mp3'));
    load.audio(MOVE_SOUND, require('audio/snd_step.mp3'));
    load.audio(MISS_SOUND, require('audio/snd_miss.mp3'));
    load.audio(MOVE_BLOCKED_SOUND, require('audio/snd_step_block.mp3'));
    load.audio(GOLD_SOUND, require('audio/snd_gold.mp3'));
    load.audio(PICK_ITEM_SOUND, require('audio/snd_item.mp3'));
    load.audio(DEATH_SOUND, require('audio/snd_death.mp3'));
  }
}
