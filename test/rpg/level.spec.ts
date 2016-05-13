import Level from '../../src/core/rpg/level';
import {WarriorLevelTable} from '../../src/core/rpg/level_table';

describe('Level', () => {
  let level: Level;

  beforeEach(() => {
    level = new Level(new WarriorLevelTable());
  });

  it("should return proper max exp", () => {
    chai.assert.strictEqual(level.current, 1);
    chai.assert.strictEqual(level.experience, 0);
    chai.assert.strictEqual(level.maxRequiredExperience, 15);
  });

  it("should add exp points but not level up", () => {
    chai.assert.isFalse(level.gain(5));
    chai.assert.strictEqual(level.experience, 5);
  });

  it("should level up because of adding exp", () => {
    chai.assert.isTrue(level.gain(30));
    chai.assert.strictEqual(level.current, 2);
    chai.assert.strictEqual(level.experience, 15);
  });
});
