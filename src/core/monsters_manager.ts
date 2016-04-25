import Mob from './objects/mob';
import DungeonScreen from './screens/dungeon_screen';
/**
* Manage all monsters in system
*/
export default class MonstersManager {
  private game : Phaser.Game;
  private monsters : Array<Mob>;
  private monstersLayer : Phaser.Group;
  private dungeonScreen : DungeonScreen;

  constructor(screen : DungeonScreen, monstersLayer : Phaser.Group) {
    this.game     = screen.game;
    this.dungeonScreen = screen;
    this.monsters = new Array<Mob>();
    this.monstersLayer = monstersLayer;
  }

  /**
  * Spawn new monster at specified position
  */
  public spawn(MobKlass: new (game: DungeonScreen) => Mob, tileX : number, tileY : number) {
    var mob : Mob = new MobKlass(this.dungeonScreen);
    this.monstersLayer.add(mob);
    mob.setTilePosition(tileX, tileY);
    this.monsters.push(mob);
  }

  /**
  * Return number of monsters
  */
  public get length() {
    return this.monsters.length;
  }

  public get(index : number) {
    return this.monsters[index];
  }
}
