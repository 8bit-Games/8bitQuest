/**
 * Player character controlled by the user
 */
import { Character } from './character';
import { LootException } from './exceptions';
import {
  EntityKind,
  getArmorRank,
  getWeaponRank,
  getKindFromString,
  isArmor,
} from '@shared/gametypes';
import { Sprite, SpriteVariant } from './sprite';
import { Item } from './item';

/**
 * Player class for user-controlled characters
 * Extends Character with inventory, equipment, and invincibility mechanics
 */
export class Player extends Character {
  public static readonly MAX_LEVEL = 10;

  // Rendering
  public nameOffsetY: number;

  // Equipment
  public spriteName: string;
  public weaponName: string | null;
  public currentArmorSprite: Sprite | SpriteVariant | null;

  // State
  public isLootMoving: boolean;
  public isSwitchingWeapon: boolean;
  public isSwitchingArmor: boolean;
  public switchingWeapon: boolean;
  public invincible: boolean;

  // Timers
  private invincibleTimeout?: number;
  private weaponBlankingInterval?: number;
  private armorBlankingInterval?: number;

  // Callbacks
  private armorloot_callback?: (itemKind: string) => void;
  private switch_callback?: () => void;
  private invincible_callback?: () => void;

  /**
   * Create a new player
   * @param id - Entity ID
   * @param name - Player name
   * @param kind - Entity kind
   */
  constructor(id: number, name: string, kind: EntityKind) {
    super(id, kind);

    this.name = name;

    // Renderer
    this.nameOffsetY = -10;

    // Equipment
    this.spriteName = 'clotharmor';
    this.weaponName = 'sword1';
    this.currentArmorSprite = null;

    // State
    this.isLootMoving = false;
    this.isSwitchingWeapon = true;
    this.isSwitchingArmor = false;
    this.switchingWeapon = false;
    this.invincible = false;
  }

  /**
   * Attempt to loot an item
   * @param item - Item to loot
   * @throws {LootException} If the item cannot be looted
   */
  loot(item: Item): void {
    if (item) {
      let rank: number | null;
      let currentRank: number | null;
      let msg: string;
      const currentArmorName = this.currentArmorSprite
        ? this.currentArmorSprite.id
        : this.spriteName;

      if (item.type === 'armor') {
        rank = getArmorRank(item.kind);
        currentRank = getArmorRank(getKindFromString(currentArmorName) || EntityKind.WARRIOR);
        msg = 'You are wearing a better armor';
      } else if (item.type === 'weapon') {
        rank = getWeaponRank(item.kind);
        currentRank = getWeaponRank(getKindFromString(this.weaponName || '') || EntityKind.SWORD1);
        msg = 'You are wielding a better weapon';
      } else {
        // Object type - no rank checking needed
        rank = null;
        currentRank = null;
        msg = '';
      }

      if (rank !== null && currentRank !== null) {
        if (rank === currentRank) {
          throw new LootException(`You already have this ${item.type}`);
        } else if (rank <= currentRank) {
          throw new LootException(msg);
        }
      }

      console.info(`Player ${this.id} has looted ${item.id}`);
      if (isArmor(item.kind) && this.invincible) {
        this.stopInvincibility();
      }
      item.onLoot(this);
    }
  }

  /**
   * Check if the player is currently walking towards an item to loot it
   * @returns true if moving to loot
   */
  isMovingToLoot(): boolean {
    return this.isLootMoving;
  }

  /**
   * Get the current sprite name
   * @returns Current sprite name
   */
  override getSpriteName(): string {
    return this.spriteName;
  }

  /**
   * Set the sprite name
   * @param name - New sprite name
   */
  setSpriteName(name: string): void {
    this.spriteName = name;
  }

  /**
   * Get the current armor name
   * @returns Armor sprite ID
   */
  getArmorName(): string {
    const sprite = this.getArmorSprite();
    return sprite.id;
  }

  /**
   * Get the current armor sprite
   * @returns Current armor sprite (or invincibility sprite if active)
   */
  getArmorSprite(): Sprite | SpriteVariant {
    if (this.invincible && this.currentArmorSprite) {
      return this.currentArmorSprite;
    } else {
      return this.sprite as Sprite | SpriteVariant;
    }
  }

  /**
   * Get the current weapon name
   * @returns Current weapon name
   */
  getWeaponName(): string | null {
    return this.weaponName;
  }

  /**
   * Set the weapon name
   * @param name - New weapon name (null to hide weapon)
   */
  setWeaponName(name: string | null): void {
    this.weaponName = name;
  }

  /**
   * Check if player has a weapon equipped
   * @returns true if weapon is equipped
   */
  override hasWeapon(): boolean {
    return this.weaponName !== null;
  }

  /**
   * Switch to a new weapon with blinking animation
   * @param newWeaponName - Name of the new weapon
   */
  switchWeapon(newWeaponName: string): void {
    let count = 14;
    let value = false;

    const toggle = (): boolean => {
      value = !value;
      return value;
    };

    if (newWeaponName !== this.getWeaponName()) {
      if (this.weaponBlankingInterval) {
        clearInterval(this.weaponBlankingInterval);
      }

      this.switchingWeapon = true;
      this.weaponBlankingInterval = window.setInterval(() => {
        if (toggle()) {
          this.setWeaponName(newWeaponName);
        } else {
          this.setWeaponName(null);
        }

        count -= 1;
        if (count === 1) {
          if (this.weaponBlankingInterval) {
            clearInterval(this.weaponBlankingInterval);
          }
          this.switchingWeapon = false;

          if (this.switch_callback) {
            this.switch_callback();
          }
        }
      }, 90);
    }
  }

  /**
   * Switch to a new armor with blinking animation
   * @param newArmorSprite - New armor sprite
   */
  switchArmor(newArmorSprite: Sprite): void {
    let count = 14;
    let value = false;

    const toggle = (): boolean => {
      value = !value;
      return value;
    };

    if (newArmorSprite && newArmorSprite.id !== this.getSpriteName()) {
      if (this.armorBlankingInterval) {
        clearInterval(this.armorBlankingInterval);
      }

      this.isSwitchingArmor = true;
      this.setSprite(newArmorSprite);
      this.setSpriteName(newArmorSprite.id);

      this.armorBlankingInterval = window.setInterval(() => {
        this.setVisible(toggle());

        count -= 1;
        if (count === 1) {
          if (this.armorBlankingInterval) {
            clearInterval(this.armorBlankingInterval);
          }
          this.isSwitchingArmor = false;

          if (this.switch_callback) {
            this.switch_callback();
          }
        }
      }, 90);
    }
  }

  /**
   * Set callback for when armor is looted
   * @param callback - Armor loot callback
   */
  onArmorLoot(callback: (itemKind: string) => void): void {
    this.armorloot_callback = callback;
  }

  /**
   * Set callback for when item is switched
   * @param callback - Item switch callback
   */
  onSwitchItem(callback: () => void): void {
    this.switch_callback = callback;
  }

  /**
   * Set callback for invincibility state changes
   * @param callback - Invincibility callback
   */
  onInvincible(callback: () => void): void {
    this.invincible_callback = callback;
  }

  /**
   * Start invincibility mode (lasts 15 seconds)
   */
  startInvincibility(): void {
    if (!this.invincible) {
      this.currentArmorSprite = this.getSprite() as Sprite | SpriteVariant;
      this.invincible = true;
      if (this.invincible_callback) {
        this.invincible_callback();
      }
    } else {
      // If the player already has invincibility, just reset its duration
      if (this.invincibleTimeout) {
        clearTimeout(this.invincibleTimeout);
      }
    }

    this.invincibleTimeout = window.setTimeout(() => {
      this.stopInvincibility();
      this.idle();
    }, 15000);
  }

  /**
   * Stop invincibility mode
   */
  stopInvincibility(): void {
    if (this.invincible_callback) {
      this.invincible_callback();
    }
    this.invincible = false;

    if (this.currentArmorSprite) {
      this.setSprite(this.currentArmorSprite);
      this.setSpriteName(this.currentArmorSprite.id);
      this.currentArmorSprite = null;
    }
    if (this.invincibleTimeout) {
      clearTimeout(this.invincibleTimeout);
      this.invincibleTimeout = undefined;
    }
  }
}

export default Player;
