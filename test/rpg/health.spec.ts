import '../../src/boot.ts';
import { StatsManager, StatsProvider, Stats } from '../../src/core/rpg/stats';
import Health from '../../src/core/rpg/health';

class DummyBaseStats implements StatsProvider {
  provideStats(stats : Array<Stats>) : void {
    var dummyStat : Stats = new Stats();
    dummyStat.health = 10;
    stats.push(dummyStat);
  };
}

describe('Health', () => {
  let health: Health;

  beforeEach(() => {
    var dummyBaseStats : DummyBaseStats     = new DummyBaseStats();
    var dummyStatsManager = new StatsManager();
    dummyStatsManager.register(dummyBaseStats);
    health = new Health(dummyStatsManager);
  });

  it('should have max health equal 10', () => {
    chai.assert.strictEqual(health.max, 10);
  });

  it('should have current health equal 10', () => {
    chai.assert.strictEqual(health.current, 10);
  });

  it('should stop regeneration if hp is full', () => {
    health.regenerate();
    chai.assert.strictEqual(health.current, 10);
  });

  it('should proper substract health', () => {
    health.sub(5);
    chai.assert.strictEqual(health.current, 5);
  });

  it('should not allow health to be nagative number', () => {
    health.sub(1000);
    chai.assert.strictEqual(health.current, 0);
  });

  it('should regenerate some hp', () => {
    health.sub(1000);
    health.regenerate();
    chai.assert.strictEqual(health.current, 1);
  });
});
