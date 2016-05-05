import Item from '../item';
import Mob from '../../objects/mob';
import Player from '../../objects/player';
import Character from '../../objects/character';
import GameObject from '../../objects/game_object';
import { PendingTurnAction, TurnDirector } from '../../objects/pending_actions/pending_turn_actions';
import Env from '../../env';
import { WeaponStats, Stats, StatsProvider } from '../../rpg/stats';
/**
* Base class describing all weapons in game
*/
abstract class Weapon extends Item implements StatsProvider {
  /**
  * Character that owns weapon
  */
  protected owner : Mob | Player;

  /**
  * Stats for weapon
  */
  public stats : WeaponStats;

  constructor(game : Phaser.Game, owner : Mob | Player) {
    super(game);
    this.stats = new WeaponStats();
    this.owner = owner;
  }

  public provideStats(stats : Array<Stats>) : void {
    stats.push(this.stats);
  }

  /**
  * Return true if attacker can atack target using this weapon
  */
  abstract canAttack(target : Player | Character | Mob | GameObject, env : Env) : boolean;

  /**
  * Pefrorm attack, calculate damage and create {PendingTurnAction}
  */
  abstract performAttack(target : Player | Character | Mob, env : Env, turnDirector : TurnDirector) : void;
}

export default Weapon;
