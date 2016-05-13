import { Stats, StatsProvider } from './stats';


abstract class LevelTable {
  private stats : Stats;
  private tempStats : Stats;

  constructor() {
    this.stats  = new Stats();
    this.tempStats = new Stats();
    this.setupBaseStats(this.stats);
  }

  /**
  * Return max level that player can reach
  */
  public abstract getMaxLevel() : number;

  /**
  * Return max required experience to reach next level on current level
  */
  public abstract getMaxExp(currentLevel : number) : number;

  /**
  * Setup base stats on start
  */
  protected abstract setupBaseStats(stats : Stats) : void;

  /**
  * calculate stats for level
  */
  protected abstract recalculateStatsForLevel(level : number, stats : Stats) : void;

  /**
  * Return calculated stats for level
  */
  public forLevel(level : number) : Stats {
    this.tempStats.set(this.stats);
    this.recalculateStatsForLevel(level, this.tempStats);
    return this.tempStats;
  }
}

/**
* Warrior stats
*/
class WarriorLevelTable extends LevelTable {
  constructor() {
    super();
  }

  protected setupBaseStats(stats : Stats) : void {
    stats.health  = 39;
    stats.defense = 1;
    stats.attack  = 4;
    stats.evasion = 2;
    stats.accuracy = 9;
  }

  public getMaxExp(currentLevel : number) : number {
    const START_EXP : number = 8;
    const EXP_GROW_FACTOR : number = 0.5;
    return START_EXP + (START_EXP * (currentLevel * EXP_GROW_FACTOR)) ;
  }

  public getMaxLevel() : number {
    return 16;
  }

  protected recalculateStatsForLevel(level : number, stats : Stats) : void {
    let healthGrowFactor : number = 0.08 * level;
    stats.health  = Math.round(stats.health + stats.health * healthGrowFactor);
  }
}

export { LevelTable, WarriorLevelTable };
