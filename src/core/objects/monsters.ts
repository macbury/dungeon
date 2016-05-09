import Ant from './monsters/ant';
import Slime from './monsters/slime';

export { Ant, Slime };

export function preloadMonsters(load : Phaser.Loader) {
  Ant.preload(load);
  Slime.preload(load);
}
