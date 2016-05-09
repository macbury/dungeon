import Item from './item';
import Gold from './gold';
import MinorHealthPotion from './potions/minor_health_potion';
import CollectableItem from '../objects/collectable_item';
export {
  Gold,
  MinorHealthPotion,
  CollectableItem,
  Item
};

/**
* Preload all assets for items here
*/
export function preloadItems(load : Phaser.Loader) {
  Gold.preload(load);
  MinorHealthPotion.preload(load);
}
