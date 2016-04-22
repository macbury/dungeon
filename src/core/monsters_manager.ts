import Mob from './objects/mob';

/**
* Manage all monsters in system
*/
export default class MonstersManager {
  private game : Phaser.Game;
  private monsters : Array<Mob>;
  private monstersLayer : Phaser.Group;

  constructor(game : Phaser.Game, monstersLayer : Phaser.Group) {
    this.game     = game;
    this.monsters = new Array<Mob>();
    this.monstersLayer = monstersLayer;
  }

  /**
  * Spawn new monster at specified position
  */
  public spawn(MobKlass: new (game: Phaser.Game) => Mob, tileX : number, tileY : number) {
    var mob : Mob = new MobKlass(this.game);
    this.monstersLayer.add(mob);
    mob.setTilePosition(tileX, tileY);
    this.monsters.push(mob);
  }
}
