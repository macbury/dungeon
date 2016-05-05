import '../../src/boot.ts';
import { StatsManager, StatsProvider, Stats } from '../../src/core/rpg/stats';

class DummyBaseStats implements StatsProvider {
  provideStats(stats : Array<Stats>) : void {
    var dummyStat : Stats = new Stats();
    dummyStat.health = 10;
    dummyStat.attack = 10;
    dummyStat.defense = 5;
    dummyStat.accuracy = 8;
    stats.push(dummyStat);
  };
}

class DummyWeaponStats implements StatsProvider {
  provideStats(stats : Array<Stats>) : void {
    var dummyStat : Stats = new Stats();
    dummyStat.attack = 10;
    dummyStat.accuracy = 8;
    dummyStat.defense = 3;
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
    chai.assert.strictEqual(dummyStatsManager.attack, 20);
  });

  it("should sum all defense", () => {
    chai.assert.strictEqual(dummyStatsManager.defense, 8);
  });

  it("should sum all accuracy", () => {
    chai.assert.strictEqual(dummyStatsManager.accuracy, 16);
  });
});
