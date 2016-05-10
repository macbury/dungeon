import '../src/boot.ts';
import { InventoryManager } from '../src/core/inventory_manager';
import { MinorHealthPotion, Corpse } from '../src/core/items/items';
import DungeonGame from '../src/core/dungeon_game';

describe('InventoryManager', () => {
  let inventory: InventoryManager;
  let game : DungeonGame;

  beforeEach(() => {
    inventory = new InventoryManager();
    game      = DungeonGame.boot(document.createElement('div'));
  });

  it("should create slot after player add one potion", () => {
    chai.assert.strictEqual(inventory.usedSlots(), 0);
    inventory.add(new MinorHealthPotion(game));
    chai.assert.strictEqual(inventory.usedSlots(), 1);
  });

  it("should create separate slots for diffrent items", () => {
    inventory.add(new MinorHealthPotion(game));
    inventory.add(new Corpse(game));
    chai.assert.strictEqual(inventory.usedSlots(), 2);
  });

  it("should stack potions", () => {
    for (let i = 0; i < 10; i++) {
      inventory.add(new MinorHealthPotion(game));
    }
    chai.assert.strictEqual(inventory.countItem(MinorHealthPotion), 10);
  });

  it("should stack in diffrent slots diffrent items", () => {
    inventory.add(new Corpse(game));
    for (let i = 0; i < 10; i++) {
      inventory.add(new MinorHealthPotion(game));
      inventory.add(new Corpse(game));
    }

    chai.assert.strictEqual(inventory.countItem(MinorHealthPotion), 10);
    chai.assert.strictEqual(inventory.countItem(Corpse), 11);
    chai.assert.strictEqual(inventory.usedSlots(), 2);
  });

  it("should return 0 if there is no Corpse in inventory", () => {
    chai.assert.strictEqual(inventory.countItem(Corpse), 0);
  });
});
