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

  constructor(screen : DungeonScreen) {
    this.game           = screen.game;
    this.dungeonScreen  = screen;
    this.monsters       = new Array<Mob>();
    this.monstersLayer  = screen.monstersLayer;
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
  * Return true if there is monster on this tile
  */
  public isOnTile(tilePos : Phaser.Point) : boolean {
    return this.getMonsterForTilePosition(tilePos) != null;
  }

  /**
  * Finds monster at tile position
  */
  public getMonsterForTilePosition(tilePos : Phaser.Point) : Mob {
    for (let i = 0; i < this.monsters.length; i++) {
      if (this.monsters[i].tilePosition.equals(tilePos)) {
        return this.monsters[i];
      }
    }
    return null;
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
