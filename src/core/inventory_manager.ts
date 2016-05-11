import {Item, MinorHealthPotion} from './items/items';
import { TurnDirector } from './objects/pending_actions/pending_turn_actions';
import Env from './env';
/**
* Describes stacks of items in inventory
*/
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
  private _gold : number;
  constructor() {
    this.slots = [];
    this._gold = 0;
  }

  /**
  * Increase number of gold
  */
  public addGold(amount : number) {
    this._gold += amount;
  }

  /**
  * Current gold obtained by player
  */
  public get gold() : number {
    return this._gold;
  }

  /**
  * Add item to inventory
  */
  public add(item : Item) {
    let itemSlot : InventorySlot = this.findOrCreateSlot(item);
    itemSlot.push(item);
  }

  /**
  * Use item. If there is no item of this type in inventory return false.
  */
  public use(itemType : any, env: Env, turnDirector : TurnDirector) : boolean {
    let item : Item = this.remove(itemType);
    if (item != null) {
      item.use(env, turnDirector);
      return true;
    } else {
      return false;
    }
  }

  /**
  * Remove item from inventory. If inventory slot for this item is empty, then removes it
  * @return true on success
  */
  public remove(itemType : any) : Item {
    let inventorySlot : InventorySlot = this.findSlotForItemType(itemType);
    if (inventorySlot == null) {
      return null;
    } else {
      let item : Item = inventorySlot.pop();
      this.removeSlotIfEmpty(inventorySlot);
      return item;
    }
  }

  /**
  * Removes slot if its empty
  */
  private removeSlotIfEmpty(inventorySlot : InventorySlot) {
    if (inventorySlot.length == 0) {
      let indexToRemove : number = this.slots.indexOf(inventorySlot);
      if (indexToRemove != -1) {
        this.slots.splice(indexToRemove, 1);
      }
    }
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
