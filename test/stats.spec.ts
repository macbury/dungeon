import '../src/boot.ts';
import { StatsManager, StatsProvider, Stats } from '../src/core/rpg/stats';

class DummyBaseStats implements StatsProvider {
  provideStats(stats : Array<Stats>) : void {
    var dummyStat : Stats = new Stats();
    dummyStat.health = 10;
    dummyStat.attack.set(60, 70);
    dummyStat.defense.set(30, 40);
    dummyStat.accuracy = 8;
    stats.push(dummyStat);
  };
}

class DummyWeaponStats implements StatsProvider {
  provideStats(stats : Array<Stats>) : void {
    var dummyStat : Stats = new Stats();
    dummyStat.attack.set(5, 10);
    dummyStat.defense.set(5, 10);
    dummyStat.accuracy = 8;
    stats.push(dummyStat);
  };
}

describe('StatsManager', () => {
  let dummyStatsManager: StatsManager;

  beforeEach(() => {
    var dummyBaseStats : DummyBaseStats     = new DummyBaseStats();
    var dummyWeaponStats : DummyWeaponStats = new DummyWeaponStats();
    dummyStatsManager = new StatsManager();
    dummyStatsManager.register(dummyBaseStats);
    dummyStatsManager.register(dummyWeaponStats);
  });

  it("should sum all health", () => {
    chai.assert.strictEqual(dummyStatsManager.health, 10);
  });

  it("should sum all attack power", () => {
    chai.assert.strictEqual(dummyStatsManager.attack.base, 65);
    chai.assert.strictEqual(dummyStatsManager.attack.min, dummyStatsManager.attack.base);
    chai.assert.strictEqual(dummyStatsManager.attack.max, 80);
  });

  it("should sum all defense", () => {
    chai.assert.strictEqual(dummyStatsManager.defense.base, 35);
    chai.assert.strictEqual(dummyStatsManager.defense.max, 50);
    chai.assert.strictEqual(dummyStatsManager.defense.min, dummyStatsManager.defense.base);
  });

  it("should sum all accuracy", () => {
    chai.assert.strictEqual(dummyStatsManager.accuracy, 16);
  });
});
