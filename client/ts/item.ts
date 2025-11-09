/**
 * Item entity class
 */
import { Entity } from './entity';
import { EntityKind, getKindAsString } from '@shared/gametypes';

/**
 * Item type
 */
export type ItemType = 'weapon' | 'armor' | 'object';

/**
 * Player interface (minimal interface for type safety)
 */
interface Player {
  switchWeapon(itemKind: string): void;
  armorloot_callback?: (itemKind: string) => void;
}

/**
 * Item class for lootable items (weapons, armor, consumables)
 */
export class Item extends Entity {
  public itemKind: string;
  public type: ItemType;
  public wasDropped: boolean;
  public lootMessage?: string;

  /**
   * Create a new item
   * @param id - Entity ID
   * @param kind - Item kind
   * @param type - Item type (weapon, armor, object)
   */
  constructor(id: number, kind: EntityKind, type: ItemType) {
    super(id, kind);

    this.itemKind = getKindAsString(kind) || '';
    this.type = type;
    this.wasDropped = false;
  }

  /**
   * Items have shadows
   */
  override hasShadow(): boolean {
    return true;
  }

  /**
   * Handle item being looted by a player
   * @param player - Player who looted the item
   */
  onLoot(player: Player): void {
    if (this.type === 'weapon') {
      player.switchWeapon(this.itemKind);
    } else if (this.type === 'armor') {
      if (player.armorloot_callback) {
        player.armorloot_callback(this.itemKind);
      }
    }
  }

  /**
   * Get the sprite name for this item
   */
  override getSpriteName(): string {
    return `item-${this.itemKind}`;
  }

  /**
   * Get the message to display when item is looted
   */
  getLootMessage(): string | undefined {
    return this.lootMessage;
  }

  /**
   * Set the loot message
   * @param message - Message to display
   */
  setLootMessage(message: string): void {
    this.lootMessage = message;
  }

  /**
   * Mark item as dropped by player
   */
  markAsDropped(): void {
    this.wasDropped = true;
  }

  /**
   * Check if item was dropped by a player
   */
  isDropped(): boolean {
    return this.wasDropped;
  }
}

export default Item;
