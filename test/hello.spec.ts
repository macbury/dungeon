import '../src/boot.ts';
import { TILE_SIZE } from '../src/core/consts';

describe('Hello', () => {
  it("should be true", () => {
    chai.assert.strictEqual(TILE_SIZE, 32);
  });
});
