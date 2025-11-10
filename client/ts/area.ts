/**
 * Rectangular area for spatial queries
 */

/**
 * Minimal interface for entities with grid position
 */
export interface AreaEntity {
  gridX: number;
  gridY: number;
}

/**
 * Area class representing a rectangular region
 * Used for collision detection, spawn zones, and other spatial queries
 */
export class Area {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  /**
   * Create a new area
   * @param x - Top-left X coordinate in grid cells
   * @param y - Top-left Y coordinate in grid cells
   * @param width - Width in grid cells
   * @param height - Height in grid cells
   */
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Check if an entity is within this area
   * @param entity - Entity to check (can be null)
   * @returns true if entity is within the area
   */
  contains(entity: AreaEntity | null): boolean {
    if (entity) {
      return (
        entity.gridX >= this.x &&
        entity.gridY >= this.y &&
        entity.gridX < this.x + this.width &&
        entity.gridY < this.y + this.height
      );
    } else {
      return false;
    }
  }
}

export default Area;
