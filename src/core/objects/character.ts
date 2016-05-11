import GameObject from './game_object';
import { PendingMoveAction } from './pending_actions/pending_move_action';
import { TurnDirector } from './pending_actions/pending_turn_actions';
import PendingDieAction from './pending_actions/pending_die_action';
import Env from '../env';
import Health from '../rpg/health';
import { TILE_SIZE, STATUS_TEXT_STYLE, TILE_CENTER } from '../consts';
import {StatsManager, Stats, StatsProvider} from '../rpg/stats';
import Item from '../items/item';
import CollectableItem from './collectable_item';
/**
* Base class for {Player} or {Mob} characters. Character can move, has animated sprite, and can be killed.
*/
abstract class Character extends GameObject implements StatsProvider {
  /**
  * Sprite with character
  */
  public sprite : Phaser.Sprite;
  /**
  * Direction in which character is facing
  */
  public direction : Phaser.Point;

  /**
  * Base character stats without weapons and equipments
  */
  public baseStats : Stats;
  /**
  * All stats with weapons and equipments
  */
  public stats  : StatsManager;

  public health : Health;

  constructor(env : Env, parent? : PIXI.DisplayObjectContainer) {
    super(env, parent);
    this.direction = new Phaser.Point();
    this.baseStats = new Stats();
    this.stats     = new StatsManager();
    this.stats.register(this);
    this.setupStatsAndEquipment();
    this.health    = new Health(this.stats);
  }

  /**
  * Runned after character creation and setup all base stats with equipment
  */
  protected abstract setupStatsAndEquipment();

  /**
  * Add stats from equipments and weapons here
  */
  public provideStats(stats : Array<Stats>) : void {
    stats.push(this.baseStats);
  }

  /**
  * Returns true if passed tile position is passable
  */
  public isPassable(otherTilePoint : Phaser.Point) : boolean {
    return this.level.isPassable(otherTilePoint) && this.characters.get(otherTilePoint.x, otherTilePoint.y) == null;
  }

  /**
  * Sets character virtual position. Addtionaly it updates character grid
  */
  public setVirtualPosition(x : number, y : number) {
    this.env.characters.set(this.virtualPosition.x, this.virtualPosition.y, null);
    this.virtualPosition.set(x, y);
    this.env.characters.set(this.virtualPosition.x, this.virtualPosition.y, this);
  }

  public setTilePosition(x : number, y : number) {
    this.env.characters.set(this.virtualPosition.x, this.virtualPosition.y, null);
    super.setTilePosition(x,y);
    this.env.characters.set(this.virtualPosition.x, this.virtualPosition.y, this);
  }

  /**
  * Updates player tilePosition to specified in parameter and updates sprite facing on {PendingMoveAction}
  * @param target - place to go on map in tile position
  * @return true if move had been performed
  */
  public move(target : Phaser.Point, turnDirector : TurnDirector) : boolean {
    this.face(target);
    if (this.isPassable(target)) {
      this.setVirtualPosition(target.x, target.y);
      return true;
    } else {
      return false;
    }
  }

  /**
  * Run all negative effects or dead here
  */
  public afterTurn(turnDirector : TurnDirector) : boolean {
    if (this.health.isDead()) {
      this.die(turnDirector);
      return true;
    }
    return false;
  }

  /**
  * @return an array of objects dropped by this character after it die
  */
  protected abstract getItemsToDrop() : Item[];

  /**
  * Triggered after character health reached 0
  */
  public die(turnDirector : TurnDirector) {
    this.health.setZero();
    turnDirector.addSingle(new PendingDieAction(this.env, this)); // make die effect for character

    /**
    * Check if there are items to drop
    */
    let itemsToDrop : Item[] = this.getItemsToDrop();
    if (itemsToDrop != null) {
      for (let i = 0; i < itemsToDrop.length; i++) {
        if (!this.env.drop(this.tilePosition, itemsToDrop[i], turnDirector)) {
          break;
        }
      }
    }
  }

  /**
  * Updates character direction
  */
  public face(target : Phaser.Point) : Phaser.Point {
    return this.direction.set(target.x, target.y)
                  .subtract(this.tilePosition.x, this.tilePosition.y)
                  .normalize();
  }

  /**
  * Flips sprite to make it look that is facing { direction }. Run automatically in update method
  */
  public updateSpriteFacingByDirection(direction : Phaser.Point) {
    if (direction.x == 1 || direction.y == -1) {
      this.sprite.scale.set(-1, 1);
    } else {
      this.sprite.scale.set(1, 1);
    }
  }

  /**
  * Spawns nice text that moves from center of sprite to above it until it fades and is removed from scene
  * @return Phaser.Tween that will be performed
  */
  public statusText(message : string, fillColor?: any) : Phaser.Tween {
    var text : Phaser.Text = this.game.add.text(TILE_CENTER,TILE_CENTER, message, STATUS_TEXT_STYLE, this);
    text.anchor.set(0.5);
    var hideTextTween : Phaser.Tween = this.game.add.tween(text).to({
      alpha: 0
    }, 100);
    hideTextTween.delay(100);

    var moveTextTween : Phaser.Tween = this.game.add.tween(text).to({
      y: 0
    }, 250, Phaser.Easing.Cubic.Out);
    moveTextTween.chain(hideTextTween);
    hideTextTween.onComplete.addOnce(() => {
      text.destroy();
    }, this);
    moveTextTween.start();
    if (fillColor != null)
      text.fill = fillColor;
    return hideTextTween;
  }

  /**
  * Checks if target is in line of sight
  * @return
  */
  public inLineOfSight(target : GameObject) : boolean {
    let lineOfSight : Phaser.Line = new Phaser.Line();
    lineOfSight.end.setTo(this.virtualPosition.x * TILE_SIZE + TILE_CENTER, this.virtualPosition.y * TILE_SIZE + TILE_CENTER);
    lineOfSight.start.setTo(target.virtualPosition.x * TILE_SIZE + TILE_CENTER, target.virtualPosition.y * TILE_SIZE + TILE_CENTER);
    //TODO iterate over tiles and check if all tiles are passable and there is no characters
    let rayTiles : Phaser.Tile[] = this.level.groundLayer.getRayCastTiles(lineOfSight)
    console.debug("Checking line of sight", [
      lineOfSight.start,
      lineOfSight.end
    ]);
    let cursor : Phaser.Point = new Phaser.Point();
    for (let i = 0; i < rayTiles.length; i++) {
      var tile : Phaser.Tile = rayTiles[i];
      cursor.set(tile.x, tile.y);
      //console.debug("Tile:", tile.collides);
      if (!this.level.isPassable(cursor)) {
        //console.debug("Tile not passable", tile.index);
        return false;
      }
      //console.debug(tile);
      var character : Character = this.characters.get(tile.x, tile.y);

      if (character != null && (character !== this && character !== target)) {
        //console.debug("Character shit", [this, character]);
        return false;
      } else if (character === target) {
        return true;
      }
    }
  //  console.debug("Done Checking line of sight");
    return false;
  }


  /**
  * Distance to target in tiles
  */
  public distance(target : GameObject) : number {
    return this.tilePosition.distance(target.tilePosition, true);
  }

  /**
  * Return true if character is facing target
  */
  public isFacing(target : GameObject) : boolean {
    return target.tilePosition.x == this.tilePosition.x || this.tilePosition.y == target.tilePosition.y;
  }

  /**
  * Return true if character is facing target and is in its line of sight
  */
  public canSee(target : GameObject) : boolean {
    return this.isFacing(target) && this.inLineOfSight(target);
  }

  /**
  * Remove character
  */
  public destroy(destroyChildren?: boolean, soft?: boolean) {
    super.destroy(destroyChildren, soft);
    this.env.characters.set(this.tilePosition.x, this.tilePosition.y, null);
  }
}

export default Character;
