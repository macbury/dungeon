import GameObject from './game_object';
import { PendingMoveAction } from './pending_actions/pending_move_action';
import { TurnDirector } from './pending_actions/pending_turn_actions';
import PendingDieAction from './pending_actions/pending_die_action';
import Env from '../env';
import Health from '../rpg/health';
import { TILE_SIZE, STATUS_TEXT_STYLE, TILE_CENTER } from '../consts';
import {StatsManager, Stats, StatsProvider} from '../rpg/stats';
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
    return this.level.isPassable(otherTilePoint) && !this.monsters.isOnTile(otherTilePoint) && !this.player.tilePosition.equals(otherTilePoint);
  }

  /**
  * Updates player tilePosition to specified in parameter and updates sprite facing on {PendingMoveAction}
  * @param target - place to go on map in tile position
  * @return true if move had been performed
  */
  public move(target : Phaser.Point, turnDirector : TurnDirector) : boolean {
    this.face(target);
    if (this.isPassable(target)) {
      this.virtualPosition.set(target.x, target.y);
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
      turnDirector.addSingle(new PendingDieAction(this.env, this));
      return true;
    }
    return false;
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
}

export default Character;
