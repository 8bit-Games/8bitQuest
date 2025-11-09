/**
 * Mob (Monster) class for hostile creatures
 */
import { Character } from './character';
import { EntityKind } from '@shared/gametypes';

/**
 * Mob class for hostile creatures that can aggro on players
 * Extends Character with aggression mechanics
 */
export class Mob extends Character {
  public aggroRange: number;
  public isAggressive: boolean;

  /**
   * Create a new mob
   * @param id - Entity ID
   * @param kind - Mob kind/type
   */
  constructor(id: number, kind: EntityKind) {
    super(id, kind);

    this.aggroRange = 1;
    this.isAggressive = true;
  }
}

export default Mob;
