/**
 * Warrior - the default player character class
 */
import { Player } from './player';
import { EntityKind } from '@shared/gametypes';

/**
 * Warrior class - default player character type
 * Extends Player with warrior-specific configuration
 */
export class Warrior extends Player {
  /**
   * Create a new warrior
   * @param id - Entity ID
   * @param name - Player name
   */
  constructor(id: number, name: string) {
    super(id, name, EntityKind.WARRIOR);
  }
}

export default Warrior;
