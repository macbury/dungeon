
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

  constructor() {
    this.statsProviders = [];
    this._stats         = [];
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
  * Accuracy. Determines the accuracy of attacks, whether it’s physical or magical.
  */
  public get evasion() : number {
    const EVASION_KEY = 'evasion';
    return this.computeStatsNumberValue(EVASION_KEY);
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
  * @param targetStats stats of target that is attacked
  * @param weaponStats stats with min and max attack used to compute final attack
  * @param random data generator
  * @return return damage done in points
  */
  public rollDamage(target : StatsManager, weapon : WeaponStats, rnd : Phaser.RandomDataGenerator) : number {
    //(attacker’s ATK + rand(minAtk, maxAtk)) – (defender’s DEF + rand(minDef, maxDef))
    var damagePoints : number = (
      this.attack + rnd.between(weapon.minAttack, weapon.maxAttack) - target.defense
    );

    if (damagePoints < 0)
      damagePoints = 0;
    return Math.round(damagePoints);
  }

  /**
  * Calculate hit probability
  * @return if the result is more than or equal to zero,  it means it hits, other than that the attack misses
  */
  public rollLuck(target: StatsManager, rnd : Phaser.RandomDataGenerator) : number {
    let hitProbability : number = this.accuracy * rnd.between(0,6) - target.evasion * rnd.between(0,6);
    return hitProbability;
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


  constructor() {
    this.reset();
  }

  public set(otherStats : Stats) : Stats {
    this.attack = otherStats.attack;
    this.health = otherStats.health;
    this.defense = otherStats.defense;
    this.accuracy = otherStats.accuracy;
    this.evasion = otherStats.evasion;
    this.intelligence = otherStats.intelligence;
    this.resistance = otherStats.resistance;
    return this;
  }

  public reset() {
    this.attack = 0;
    this.health = 0;
    this.defense = 0;
    this.accuracy = 0;
    this.evasion = 0;
    this.intelligence = 0;
    this.resistance = 0;
  }
}

/**
* These stats will add to player’s stats to help them in battle
*/
export class WeaponStats extends Stats {
  /**
  * Weapon’s lowest attack
  */
  public minAttack: number;

  /**
  * Weapon’s highest attack
  */
  public maxAttack: number;

  public reset() {
    super.reset();
    this.maxAttack = this.minAttack = 0;
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
