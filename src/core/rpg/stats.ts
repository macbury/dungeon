
/**
* This interface allows to provide {Stats} instance to {StatsManager}
*/
export interface StatsProvider {
  provideStats(stats : Array<Stats>) : void;
}

/**
* This class consumes information about each {Stats} object and gives final stats from them.
*/
export class StatsManager {
  /**
  * List of stats providers from which we collect all {Stats}
  */
  private statsProviders : Array<StatsProvider>;
  private _stats : Array<Stats>;

  constructor() {
    this.statsProviders = [];
    this._stats         = [];
  }

  /**
  * Recalculate all stats
  */
  private computeStatsValue(paramName : string) : number {
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

  /**
  * Health Points, the maximum health of the character/enemy, if the health is healed, it may not exceed this points
  */
  public get health() : number {
    const HEALTH_KEY = 'health';
    return this.computeStatsValue(HEALTH_KEY);
  }

  /**
  * Attack power. Determines the power of physical attack
  */
  public get attack() : number {
    const ATTACK_KEY = 'attack';
    return this.computeStatsValue(ATTACK_KEY);
  }

  /**
  * Defense power. Determines the power of physical defense.
  */
  public get defense() : number {
    const DEFENSE_KEY = 'defense';
    return this.computeStatsValue(DEFENSE_KEY);
  }

  /**
  * Accuracy. Determines the accuracy of attacks, whether it’s physical or magical.
  */
  public get accuracy() : number {
    const ACCURACY_KEY = 'accuracy';
    return this.computeStatsValue(ACCURACY_KEY);
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
  public attack : number;
  /**
  * Defense power. Determines the power of physical defense.
  */
  public defense : number;
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
    this.reset();
  }

  public reset() {
    this.attack = 0;
    this.health = 0;
    this.defense = 0;
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
  public minValue  : number;
  public baseValue : number;
  public maxValue  : number;
}
