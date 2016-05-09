import Character from './character';
import Mob from './mob';
import Weapon from '../items/weapons/weapon';
import { TILE_CENTER, TILE_SIZE, GAME_OBJECT_FRAME_RATE, PLAYER_MOVE_SPEED } from '../consts';
import DungeonScreen from '../screens/dungeon_screen';
import { PendingPlayerMoveAction, PendingPlayerMoveBlockedAction } from './pending_actions/pending_move_action';
import { PendingTurnAction, TurnDirector } from './pending_actions/pending_turn_actions';
import Env from '../env';
import Fist from '../items/weapons/fist';
import Sword from '../items/weapons/sword';
import { Stats } from '../rpg/stats';
import Item from '../items/item';
import CollectableItem from './collectable_item';
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

  constructor(env : Env, parent? : PIXI.DisplayObjectContainer) {
    super(env, parent);
    this.sprite = this.game.add.sprite(TILE_CENTER, TILE_CENTER, PLAYER_SPRITE_NAME, null, this);
    this.sprite.anchor.set(0.5,0.5);

    this.idleAnimation = this.sprite.animations.add('idle', [0, 1], GAME_OBJECT_FRAME_RATE, true);
    this.idleAnimation.play();
  }

  protected setupStatsAndEquipment() {
    this.fistWeapon        = new Fist(this.game, this);
    this.mainWeapon        = new Sword(this.game, this);
    this.baseStats.health  = 48;
    this.baseStats.defense = 1;
    this.baseStats.attack  = 4;
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
  public attack(target: Mob, env : Env, turnDirector : TurnDirector) : boolean {
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
    console.warn("Implement object picking");
    if (this.objects.isCollectable(this.tilePosition.x, this.tilePosition.y)) {
      let collectable : CollectableItem = <CollectableItem>this.objects.get(this.tilePosition.x, this.tilePosition.y);
      console.log(collectable);
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

  protected getItemsToDrop() : Item[] {
    console.warn("Implement this");
    return [];
  }
}
