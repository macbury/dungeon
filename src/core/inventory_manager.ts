import Item from './items/item';

class InventorySlot {
  public item : Item;
  public amount : number;

}

export default class InventoryManager {
  /**
  * Add item to inventory
  */
  public add(item : Item) {
    console.warn("Implement using", item);
  }
}
