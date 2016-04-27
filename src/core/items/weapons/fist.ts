import Weapon from './weapon';
import Character from '../../objects/character';
import Mob from '../../objects/mob';
import GameObject from '../../objects/game_object';
import { PendingTurnAction } from '../../objects/pending_actions/pending_turn_actions';

export default class Fist extends Weapon {

  /**
  * Return true if attacker can atack target using this weapon
  */
  public canAttack(target : Character | Mob | GameObject) : boolean {
    return false;
  }

  /**
  * Pefrorm attack and create {PendingTurnAction}
  */
  public performAttack(target : Character | Mob) : PendingTurnAction<Character> {
    return null;
  }

  public static preload(load : Phaser.Loader) : void {

  }
}
