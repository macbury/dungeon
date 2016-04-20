
import Mob from './objects/mob';

/**
* Manage all monsters in system
*/
export default class MonstersManager {
  private game : Phaser.Game;
  private monsters : Array<Mob>;

  constructor(game : Phaser.Game) {
    this.game = game;
    this.monsters = new Array<Mob>();
  }

  public create(spriteName : string) : Mob {
    var mob : Mob = new Mob(this.game, spriteName);
    this.monsters.push(mob);
    return mob;
  }
}
