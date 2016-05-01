
/**
* This interface allows to provide {Stats} instance to {StatsManager}
*/
export interface StatsProvider {
  provideStats(stats : Array<Stats>) : void;
}

/**
* This class consumes information about each {Stats} object and gives final stats from them.
* Monsters and player characters will have the same stats, only differs in the value.
*/
export class StatsManager {
  /**
  * List of stats providers from which we collect all {Stats}
  */
  private statsProviders : Array<StatsProvider>;
  private _stats : Array<Stats>;

  private _cacheAttack : MinMaxStat;
  private _cacheDefense : MinMaxStat;
  constructor() {
    this.statsProviders = [];
    this._stats         = [];
    this._cacheAttack   = new MinMaxStat();
    this._cacheDefense   = new MinMaxStat();
  }

  /**
  * Recalculate all stats
  */
  private computeStatsNumberValue(paramName : string) : number {
    this._stats         = []
    for (let i = 0; i < this.statsProviders.length; i++) {
      this.statsProviders[i].provideStats(this._stats);
    }

    var output = 0;
    for (let i = 0; i < this._stats.length; i++) {
      var stats : Stats = this._stats[i];
      output += stats[paramName];
    }
    return output;
  }

  private computeStatsMinMaxValue(paramName : string, output : MinMaxStat) : MinMaxStat {
    this._stats         = []
    for (let i = 0; i < this.statsProviders.length; i++) {
      this.statsProviders[i].provideStats(this._stats);
    }

    output.setZero();
    for (let i = 0; i < this._stats.length; i++) {
      var stats : Stats = this._stats[i];
      output.add(<MinMaxStat>stats[paramName]);
    }
    return output;
  }

  /**
  * Health Points, the maximum health of the character/enemy, if the health is healed, it may not exceed this points
  */
  public get health() : number {
    const HEALTH_KEY = 'health';
    return this.computeStatsNumberValue(HEALTH_KEY);
  }

  /**
  * Attack power. Determines the power of physical attack
  */
  public get attack() : MinMaxStat {
    const ATTACK_KEY = 'attack';
    this.computeStatsMinMaxValue(ATTACK_KEY, this._cacheAttack);
    return this._cacheAttack;
  }

  /**
  * Defense power. Determines the power of physical defense.
  */
  public get defense() : MinMaxStat {
    const DEFENSE_KEY = 'defense';
    this.computeStatsMinMaxValue(DEFENSE_KEY, this._cacheDefense);
    return this._cacheDefense;
  }

  /**
  * Accuracy. Determines the accuracy of attacks, whether it’s physical or magical.
  */
  public get accuracy() : number {
    const ACCURACY_KEY = 'accuracy';
    return this.computeStatsNumberValue(ACCURACY_KEY);
  }

  /**
  * Registers stats provider
  */
  public register(provider : StatsProvider) : void {
    if (this.statsProviders.indexOf(provider) == -1) {
      this.statsProviders.push(provider);
    } else {
      throw "You cannot add second time the same StatProvider!"
    }
  }

  /**
  * Remove registered stats provider
  */
  public remove(provider : StatsProvider) : void {
    var index : number = this.statsProviders.indexOf(provider);
    if (index != -1) {
      this.statsProviders.slice(index, 1);
    }
  }
}

/**
* This class contains all information about statistics
*/
export class Stats {
  /**
  * Health Points, the maximum health of the character/enemy, if the health is healed, it may not exceed this points
  */
  public health : number;
  /**
  * Attack power. Determines the power of physical attack
  */
  public attack : MinMaxStat;
  /**
  * Defense power. Determines the power of physical defense.
  */
  public defense : MinMaxStat;
  /**
  * Accuracy. Determines the accuracy of attacks, whether it’s physical or magical.
  */
  public accuracy : number;
  /**
  * Evasion. Determines whether the character is able to evade enemy’s attacks.
  */
  public evasion : number;
  /**
  * Intelligence. Determines magical attack power.
  */
  public intelligence : number;
  /**
  * Resistance. Determines magical defense power.
  */
  public resistance : number;
  /**
  * Luck. Determines various things, from critical attack to item drop rate , or something elsa.
  */
  public luck : number;

  constructor() {
    this.attack = new MinMaxStat();
    this.defense = new MinMaxStat();
    this.reset();
  }

  public reset() {
    this.attack.setZero();
    this.health = 0;
    this.defense.setZero();
    this.accuracy = 0;
    this.evasion = 0;
    this.intelligence = 0;
    this.resistance = 0;
    this.luck = 0;
  }
}

/**
* This class not only contains information about base stat, but also min and max value that helps calculation for ex. attack power
*/
export class MinMaxStat {
  public min  : number;
  public max  : number;

  constructor() {
    this.setZero();
  }

  public get base() : number {
    return this.min;
  }

  /**
  * Set 0 for all values
  */
  public setZero() : MinMaxStat {
    this.min = this.max = 0;
    return this;
  }

  /**
  * Add other MinMaxStat to current
  */
  public add(otherMinMaxStat : MinMaxStat) : MinMaxStat {
    this.min += otherMinMaxStat.min;
    this.max += otherMinMaxStat.max;
    return this;
  }

  public set(min : number, max : number) : MinMaxStat {
    this.min  = min;
    this.max  = max;
    return this;
  }
}
