import {Item, MinorHealthPotion} from './items/items';

export class InventorySlot extends Array<Item> {
  /**
  * A item type(class constructor for checking item type)
  */
  public type : any;
}

/**
* This class manages player inventory, stacking items, managing equipment etc
*/
export class InventoryManager {
  private slots : Array<InventorySlot>;

  constructor() {
    this.slots = [];

  }

  /**
  * Add item to inventory
  */
  public add(item : Item) {
    let itemSlot : InventorySlot = this.findOrCreateSlot(item);
    itemSlot.push(item);
  }

  /**
  * Remove item from inventory. If inventory slot for this item is empty, then removes it
  */
  public remove(item : Item) {

  }

  /**
  * List all slots in inventory
  */
  public all() : InventorySlot[] {
    return this.slots;
  }

  /**
  * Return number of item in inventory
  */
  public countItem(itemType : any) : number {
    let inventorySlot : InventorySlot = this.findSlotForItemType(itemType);
    if (inventorySlot == null) {
      return 0;
    } else {
      return inventorySlot.length;
    }
  }

  /**
  * Finds InventorySlot by Item type
  */
  public findSlotForItemType(itemType: any) : InventorySlot {
    for (let i = 0; i < this.slots.length; i++) {
      if (itemType == this.slots[i].type) {
        return this.slots[i];
      }
    }

    return null;
  }

  /**
  * Searches for existing inventory slot for this type of item. Otherwise creates it
  */
  private findOrCreateSlot(item : Item) : InventorySlot {
    let slot : InventorySlot = this.findSlotForItemType(item.constructor);

    if (slot == null) {
      slot = new InventorySlot();
      slot.type = item.constructor;
      this.slots.push(slot);
    }

    return slot;
  }

  /**
  * Return number of slots in game
  */
  public usedSlots() : number {
    return this.slots.length;
  }
}
