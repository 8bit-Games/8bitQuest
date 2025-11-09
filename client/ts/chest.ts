/**
 * Chest entity for loot containers
 */
import { Entity } from './entity';
import { EntityKind } from '@shared/gametypes';

/**
 * Chest class for openable loot containers
 */
export class Chest extends Entity {
  private open_callback: (() => void) | null;

  /**
   * Create a new chest
   * @param id - Entity ID
   * @param kind - Entity kind (usually CHEST)
   */
  constructor(id: number, kind: EntityKind) {
    super(id, EntityKind.CHEST);
    this.open_callback = null;
  }

  /**
   * Get the sprite name for this chest
   * @returns 'chest'
   */
  override getSpriteName(): string {
    return 'chest';
  }

  /**
   * Chests don't move
   * @returns false
   */
  override isMoving(): boolean {
    return false;
  }

  /**
   * Open the chest
   * Triggers the open callback if set
   */
  open(): void {
    if (this.open_callback) {
      this.open_callback();
    }
  }

  /**
   * Set callback for when chest is opened
   * @param callback - Function to call when chest opens
   */
  onOpen(callback: () => void): void {
    this.open_callback = callback;
  }
}

export default Chest;
