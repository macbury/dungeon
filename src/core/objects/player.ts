import Character from './character';
import Mob from './mob';
import { TILE_CENTER, TILE_SIZE, GAME_OBJECT_FRAME_RATE, PLAYER_MOVE_SPEED } from '../consts';
import DungeonScreen from '../screens/dungeon_screen';
import { PendingPlayerMoveAction, PendingPlayerMoveBlockedAction } from './pending_actions/pending_move_action';
import { PendingTurnAction, TurnDirector } from './pending_actions/pending_turn_actions';
import PendingPlayerExperienceGainAction from './pending_actions/pending_player_experience_gain_action';
import Env from '../env';
import { Fist, Sword, Corpse, Item, Weapon } from '../items/items';
import { Stats } from '../rpg/stats';
import CollectableItem from './collectable_item';
import PendingPickObjectAction from './pending_actions/pending_pick_object_action';
import PendingPlayerDieAction from './pending_actions/pending_player_die_action';
import Level from '../rpg/level';
const PLAYER_SPRITE_NAME = 'player_character';

/**
* Main player class.
*/
export default class Player extends Character {
  private idleAnimation : Phaser.Animation;
  /**
  * Main weapon used by player
  */
  public mainWeapon     : Weapon;
  /**
  * This weapon is used if there is no mainWeapon setted
  */
  public fistWeapon     : Fist;
  /**
  * Current player level
  */
  public level          : Level;

  constructor(env : Env, parent? : PIXI.DisplayObjectContainer) {
    super(env, parent);
    this.sprite = this.game.add.sprite(TILE_CENTER, TILE_CENTER, PLAYER_SPRITE_NAME, null, this);
    this.sprite.anchor.set(0.5,0.5);

    this.idleAnimation = this.sprite.animations.add('idle', [0, 1], GAME_OBJECT_FRAME_RATE, true);
    this.idleAnimation.play();
  }

  protected setupStatsAndEquipment() {
    this.level             = new Level();
    this.fistWeapon        = new Fist(this.game, this);
    this.mainWeapon        = new Sword(this.game, this);
    this.baseStats.health  = 48;
    this.baseStats.defense = 1;
    this.baseStats.attack  = 4;
    this.baseStats.evasion = 4;
    this.baseStats.accuracy = 5;
  }

  /**
  * Agregate stats from weapons and equippment
  */
  public provideStats(stats : Array<Stats>) : void {
    super.provideStats(stats);
    if (this.fistWeapon != null)
      this.fistWeapon.provideStats(stats);
    if (this.mainWeapon != null)
      this.mainWeapon.provideStats(stats);
  }

  /**
  * Creates move action for {Player}
  * @param target - place to go on map in tile position
  * @return true if move performed
  */
  public move(target : Phaser.Point, turnDirector : TurnDirector) : boolean  {
    if (super.move(target, turnDirector)) {
      turnDirector.addParell(new PendingPlayerMoveAction(this.env, this, target));
      return true;
    } else {
      turnDirector.addSingle(new PendingPlayerMoveBlockedAction(this.env, this, target));
      return false
    }
  }

  /**
  * Performs attack on target using main weapon. If mainWeapon is null then attack with fist. If Mob is out of range then returns null.
  * @return true if performed attack
  */
  public attack(target: Character, env : Env, turnDirector : TurnDirector) : boolean {
    this.face(target.tilePosition);
    if (this.mainWeapon != null) {
      if (this.mainWeapon.canAttack(target, env)) {
        this.mainWeapon.performAttack(target, env, turnDirector);
        return true;
      } else {
        return false;
      }
    } else {
      if (this.fistWeapon.canAttack(target, env)) {
        this.fistWeapon.performAttack(target, env, turnDirector);
        return true;
      } else {
        return false;
      }
    }
  }

  /**
  * Player will try to pick item beneath him. If there is item then it adds pending action, updates inventory and returns true
  */
  public pickedObject(turnDirector : TurnDirector) : boolean {
    if (this.objects.isCollectable(this.tilePosition.x, this.tilePosition.y)) {
      let collectable : CollectableItem = <CollectableItem>this.objects.get(this.tilePosition.x, this.tilePosition.y);
      turnDirector.addSingle(new PendingPickObjectAction(this.env, collectable));
      if (collectable.item.consumeOnPick) {
        collectable.item.use(this.env, turnDirector);
      } else {
        this.env.inventory.add(collectable.item);
      }
      return true;
    }
    return false;
  }

  /**
  * Enable follow camera
  */
  public follow(camera : Phaser.Camera) {
    camera.follow(<any>this);
  }

  public static preload(load : Phaser.Loader) : void {
    load.spritesheet(PLAYER_SPRITE_NAME, require('player.png'), TILE_SIZE, TILE_SIZE);
    Fist.preload(load);
  }

  public get name() {
    //TODO: change this
    return "Player";
  }

  /**
  * Description of character that will be displayed in ui
  */
  public get description() {
    //TODO Change this
    return "Our main hero";
  }

  /**
  * Adds experience points to player and create pending action with effect for leveling
  */
  public gainExp(experience : number, turnDirector : TurnDirector) {
    let gainLevel : boolean = this.level.gain(experience);
    turnDirector.addSingle(new PendingPlayerExperienceGainAction(this.env, this, experience, gainLevel));
  }

  protected getItemsToDrop() : Item[] {
    return [new Corpse(this.game)];
  }
}
