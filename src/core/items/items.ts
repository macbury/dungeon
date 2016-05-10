import Item from './item';
import Weapon from './weapons/weapon';
import Gold from './gold';
import Corpse from './corpse';

import Fist from './weapons/fist';
import Sword from './weapons/sword';

import MinorHealthPotion from './potions/minor_health_potion';
import CollectableItem from '../objects/collectable_item';
export {
  Gold,
  MinorHealthPotion,
  CollectableItem,
  Item,
  Corpse,
  Fist,
  Sword,
  Weapon
};

/**
* Preload all assets for items here
*/
export function preloadItems(load : Phaser.Loader) {
  Gold.preload(load);
  MinorHealthPotion.preload(load);
  Corpse.preload(load);
  Fist.preload(load);
  Sword.preload(load);
}
