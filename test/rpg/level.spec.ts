import Level from '../../src/core/rpg/level';

describe('Level', () => {
  let level: Level;

  beforeEach(() => {
    level = new Level();
  });

  it("should add exp points", () => {
    level.gain(5);
    chai.assert.strictEqual(level.experience, 5);
  });
});
