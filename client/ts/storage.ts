/**
 * Local storage manager for player data and achievements
 */

/**
 * Player data structure
 */
export interface PlayerData {
  name: string;
  weapon: string;
  armor: string;
  image: string;
}

/**
 * Achievements data structure
 */
export interface AchievementsData {
  unlocked: number[];
  ratCount: number;
  skeletonCount: number;
  totalKills: number;
  totalDmg: number;
  totalRevives: number;
}

/**
 * Complete storage data structure
 */
export interface StorageData {
  hasAlreadyPlayed: boolean;
  player: PlayerData;
  achievements: AchievementsData;
}

/**
 * Storage class for managing persistent game data
 * Uses localStorage to save player progress and achievements
 */
export class Storage {
  public data: StorageData;

  /**
   * Create a new storage manager
   * Loads data from localStorage if available
   */
  constructor() {
    if (this.hasLocalStorage() && localStorage.data) {
      try {
        this.data = JSON.parse(localStorage.data);
      } catch (e) {
        console.error('Failed to parse storage data, resetting...', e);
        this.resetData();
      }
    } else {
      this.resetData();
    }
  }

  /**
   * Reset data to default values
   */
  resetData(): void {
    this.data = {
      hasAlreadyPlayed: false,
      player: {
        name: '',
        weapon: '',
        armor: '',
        image: '',
      },
      achievements: {
        unlocked: [],
        ratCount: 0,
        skeletonCount: 0,
        totalKills: 0,
        totalDmg: 0,
        totalRevives: 0,
      },
    };
  }

  /**
   * Check if localStorage is available
   * @returns true if localStorage is supported
   */
  hasLocalStorage(): boolean {
    try {
      return typeof Storage !== 'undefined' && typeof localStorage !== 'undefined';
    } catch (e) {
      return false;
    }
  }

  /**
   * Save current data to localStorage
   */
  save(): void {
    if (this.hasLocalStorage()) {
      try {
        localStorage.data = JSON.stringify(this.data);
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
    }
  }

  /**
   * Clear all saved data
   */
  clear(): void {
    if (this.hasLocalStorage()) {
      localStorage.data = '';
      this.resetData();
    }
  }

  // Player methods

  /**
   * Check if player has played before
   * @returns true if player has already played
   */
  hasAlreadyPlayed(): boolean {
    return this.data.hasAlreadyPlayed;
  }

  /**
   * Initialize player with name
   * @param name - Player name
   */
  initPlayer(name: string): void {
    this.data.hasAlreadyPlayed = true;
    this.setPlayerName(name);
  }

  /**
   * Set player name
   * @param name - Player name
   */
  setPlayerName(name: string): void {
    this.data.player.name = name;
    this.save();
  }

  /**
   * Set player image
   * @param img - Image identifier
   */
  setPlayerImage(img: string): void {
    this.data.player.image = img;
    this.save();
  }

  /**
   * Set player armor
   * @param armor - Armor identifier
   */
  setPlayerArmor(armor: string): void {
    this.data.player.armor = armor;
    this.save();
  }

  /**
   * Set player weapon
   * @param weapon - Weapon identifier
   */
  setPlayerWeapon(weapon: string): void {
    this.data.player.weapon = weapon;
    this.save();
  }

  /**
   * Save all player data at once
   * @param img - Image identifier
   * @param armor - Armor identifier
   * @param weapon - Weapon identifier
   */
  savePlayer(img: string, armor: string, weapon: string): void {
    this.setPlayerImage(img);
    this.setPlayerArmor(armor);
    this.setPlayerWeapon(weapon);
  }

  // Achievement methods

  /**
   * Check if achievement is unlocked
   * @param id - Achievement ID
   * @returns true if unlocked
   */
  hasUnlockedAchievement(id: number): boolean {
    return this.data.achievements.unlocked.includes(id);
  }

  /**
   * Unlock an achievement
   * @param id - Achievement ID
   * @returns true if newly unlocked, false if already unlocked
   */
  unlockAchievement(id: number): boolean {
    if (!this.hasUnlockedAchievement(id)) {
      this.data.achievements.unlocked.push(id);
      this.save();
      return true;
    }
    return false;
  }

  /**
   * Get total number of unlocked achievements
   * @returns Achievement count
   */
  getAchievementCount(): number {
    return this.data.achievements.unlocked.length;
  }

  // Angry Rats achievement

  /**
   * Get rat kill count
   * @returns Rat count
   */
  getRatCount(): number {
    return this.data.achievements.ratCount;
  }

  /**
   * Increment rat kill count (max 10)
   */
  incrementRatCount(): void {
    if (this.data.achievements.ratCount < 10) {
      this.data.achievements.ratCount++;
      this.save();
    }
  }

  // Skull Collector achievement

  /**
   * Get skeleton kill count
   * @returns Skeleton count
   */
  getSkeletonCount(): number {
    return this.data.achievements.skeletonCount;
  }

  /**
   * Increment skeleton kill count (max 10)
   */
  incrementSkeletonCount(): void {
    if (this.data.achievements.skeletonCount < 10) {
      this.data.achievements.skeletonCount++;
      this.save();
    }
  }

  // Meatshield achievement

  /**
   * Get total damage taken
   * @returns Total damage
   */
  getTotalDamageTaken(): number {
    return this.data.achievements.totalDmg;
  }

  /**
   * Add damage to total (max 5000)
   * @param damage - Damage amount to add
   */
  addDamage(damage: number): void {
    if (this.data.achievements.totalDmg < 5000) {
      this.data.achievements.totalDmg += damage;
      this.save();
    }
  }

  // Hunter achievement

  /**
   * Get total kill count
   * @returns Total kills
   */
  getTotalKills(): number {
    return this.data.achievements.totalKills;
  }

  /**
   * Increment total kill count (max 50)
   */
  incrementTotalKills(): void {
    if (this.data.achievements.totalKills < 50) {
      this.data.achievements.totalKills++;
      this.save();
    }
  }

  // Still Alive achievement

  /**
   * Get total revive count
   * @returns Revive count
   */
  getTotalRevives(): number {
    return this.data.achievements.totalRevives;
  }

  /**
   * Increment revive count (max 5)
   */
  incrementRevives(): void {
    if (this.data.achievements.totalRevives < 5) {
      this.data.achievements.totalRevives++;
      this.save();
    }
  }
}

export default Storage;
