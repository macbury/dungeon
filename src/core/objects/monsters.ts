import Ant from './monsters/ant';
import Slime from './monsters/slime';
import Mob from './mob';
export { Ant, Slime, Mob };

export function preloadMonsters(load : Phaser.Loader) {
  Ant.preload(load);
  Slime.preload(load);
  Mob.preload(load);
}
