import '../../src/boot.ts';
import DungeonGame from '../../src/core/dungeon_game';
import Character from '../../src/core/objects/character';
import Item from '../../src/core/items/item';
import Env from '../../src/core/env';
import DungeonScreen from '../../src/core/screens/dungeon_screen';
class DummyCharacter extends Character {
  getItemsToDrop() : Item[] { return [] }
  protected setupStatsAndEquipment() {}
}

describe('Character', () => {
  let game : DungeonGame;
  let character : Character;
  let env       : Env;

});
