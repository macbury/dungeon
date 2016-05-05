
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
  public get attack() : number {
    const ATTACK_KEY = 'attack';
    return this.computeStatsNumberValue(ATTACK_KEY);
  }

  /**
  * Defense power. Determines the power of physical defense.
  */
  public get defense() : number {
    const DEFENSE_KEY = 'defense';
    return this.computeStatsNumberValue(DEFENSE_KEY);
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

  /**
  * Calculates damage that would be done to passed target
  * @param targetStats used to compute damage
  * @return return damage done in points
  */
  public rollDamage(targetStats : StatsManager, weaponStats? : any) : number {
    //(attacker’s ATK + rand(minAtk, maxAtk)) – (defender’s DEF + rand(minDef, maxDef))
    //var damage : number = (this.attack.value + (Math.random() * this.attack.max)) - (targetStats.defense.value + (Math.random() * targetStats.defense.max));
    //if (damage < 0) {
    //  damage = 0;
    //}
    //return Math.round(damage);
    return 0;
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
  public min  : number;
  public max  : number;

  constructor() {
    this.setZero();
  }

  /**
  * Reference to min
  */
  public get base() : number {
    return this.min;
  }

  /**
  * Reference to min
  */
  public get value() : number {
    return this.min;
  }

  public set base(newBase : number) {
    this.min = newBase;
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
