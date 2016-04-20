import BaseState from '../fsm/base';
import DungeonScreen   from '../screens/dungeon_screen';
import PathFinderPlugin from '../../lib/path_finder_plugin';
import Level from '../level';
import Player from '../objects/player';
/**
* Base state class that exposes context {DungeonScreen methods}
*/
export default class BaseDungeonScreenState extends BaseState<DungeonScreen> {
  /**
  * Reference to input manager
  */
  public get input() : Phaser.Input {
    return this.context.input;
  }

  /**
  * Reference to path finding plugin
  */
  public get pathFinding() : PathFinderPlugin {
    return this.context.pathFinding;
  }

  /**
  * Reference to Level
  */
  public get level() : Level {
    return this.context.level;
  }

  /**
  * Reference to player class
  */
  public get player() : Player {
    return this.context.player;
  }

  /**
  * A reference to the GameObjectFactory which can be used to add new objects to the World.
  */
  public get add() : Phaser.GameObjectFactory {
    return this.context.add;
  }
}