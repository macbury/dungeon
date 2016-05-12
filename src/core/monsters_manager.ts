import Mob from './objects/mob';
import Env from './env';
/**
* Manage all monsters in system
*/
export default class MonstersManager {
  private game : Phaser.Game;
  private monsters : Array<Mob>;
  private env : Env;

  constructor(env : Env) {
    this.game           = env.game;
    this.env            = env;
    this.monsters       = new Array<Mob>();
  }

  /**
  * Spawn new monster at specified position
  */
  public spawn(MobKlass: new (env: Env) => Mob, tileX : number, tileY : number) : boolean {
    if (this.env.characters.isEmpty(tileX, tileY) && this.env.map.isPassable(new Phaser.Point(tileX, tileY))) {
      var mob : Mob = new MobKlass(this.env);
      this.env.screen.gameObjectsLayer.add(mob);
      mob.setTilePosition(tileX, tileY);
      this.monsters.push(mob);
      return true;
    } else {
      return false;
    }
  }

  /**
  * Remove passed monster
  */
  public remove(killedMob : Mob) {
    console.debug("Going to remove", killedMob);
    var indexToRemove : number = this.monsters.indexOf(killedMob);
    if (indexToRemove != -1) {
      console.debug("Removed monster", indexToRemove);
      this.monsters.splice(indexToRemove, 1);
    }
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
