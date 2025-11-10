/**
 * Pathfinder using A* algorithm for entity movement
 */
// @ts-expect-error - AStar is a legacy library without types
import AStar from '../js/lib/astar';

/**
 * Interface for entities that can be used in pathfinding
 */
export interface PathfindingEntity {
  gridX: number;
  gridY: number;
  nextGridX: number;
  nextGridY: number;
  isMoving(): boolean;
}

/**
 * Pathfinder class using A* algorithm
 * Handles pathfinding with collision detection and entity ignoring
 */
export class Pathfinder {
  public width: number;
  public height: number;
  public grid: number[][] | null;
  public blankGrid: number[][];
  private ignored: PathfindingEntity[];

  /**
   * Create a new pathfinder
   * @param width - Grid width
   * @param height - Grid height
   */
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = null;
    this.blankGrid = [];
    this.initBlankGrid_();
    this.ignored = [];
  }

  /**
   * Initialize a blank grid with no obstacles
   * @private
   */
  private initBlankGrid_(): void {
    for (let i = 0; i < this.height; i += 1) {
      this.blankGrid[i] = [];
      for (let j = 0; j < this.width; j += 1) {
        this.blankGrid[i][j] = 0;
      }
    }
  }

  /**
   * Find a path from entity's position to target coordinates
   * @param grid - Collision grid (0 = walkable, 1 = blocked)
   * @param entity - Entity to find path for
   * @param x - Target X coordinate
   * @param y - Target Y coordinate
   * @param findIncomplete - Whether to find incomplete path if full path is blocked
   * @returns Array of [x, y] coordinates representing the path
   */
  findPath(
    grid: number[][],
    entity: PathfindingEntity,
    x: number,
    y: number,
    findIncomplete?: boolean
  ): number[][] {
    const start: [number, number] = [entity.gridX, entity.gridY];
    const end: [number, number] = [x, y];
    let path: number[][];

    this.grid = grid;
    this.applyIgnoreList_(true);
    path = AStar(this.grid, start, end);

    if (path.length === 0 && findIncomplete === true) {
      // If no path was found, try and find an incomplete one
      // to at least get closer to destination.
      path = this.findIncompletePath_(start, end);
    }

    return path;
  }

  /**
   * Finds a path which leads the closest possible to an unreachable x, y position.
   *
   * Whenever A* returns an empty path, it means that the destination tile is unreachable.
   * We would like the entities to move the closest possible to it though, instead of
   * staying where they are without moving at all. That's why we have this function which
   * returns an incomplete path to the chosen destination.
   *
   * @private
   * @param start - Starting coordinates [x, y]
   * @param end - Target coordinates [x, y]
   * @returns The incomplete path towards the end position
   */
  private findIncompletePath_(start: [number, number], end: [number, number]): number[][] {
    const perfect: number[][] = AStar(this.blankGrid, start, end);
    let x: number;
    let y: number;
    let incomplete: number[][] = [];

    for (let i = perfect.length - 1; i > 0; i -= 1) {
      x = perfect[i][0];
      y = perfect[i][1];

      if (this.grid && this.grid[y][x] === 0) {
        incomplete = AStar(this.grid, start, [x, y]);
        break;
      }
    }
    return incomplete;
  }

  /**
   * Removes colliding tiles corresponding to the given entity's position in the pathing grid.
   * This allows pathfinding to ignore specific entities.
   * @param entity - Entity to ignore in pathfinding
   */
  ignoreEntity(entity: PathfindingEntity | null): void {
    if (entity) {
      this.ignored.push(entity);
    }
  }

  /**
   * Apply or remove the ignore list to/from the grid
   * @private
   * @param ignored - If true, mark ignored entities as walkable; if false, restore collision
   */
  private applyIgnoreList_(ignored: boolean): void {
    this.ignored.forEach((entity) => {
      const x = entity.isMoving() ? entity.nextGridX : entity.gridX;
      const y = entity.isMoving() ? entity.nextGridY : entity.gridY;

      if (x >= 0 && y >= 0 && this.grid) {
        this.grid[y][x] = ignored ? 0 : 1;
      }
    });
  }

  /**
   * Clear the list of ignored entities and restore their collision
   */
  clearIgnoreList(): void {
    this.applyIgnoreList_(false);
    this.ignored = [];
  }
}

export default Pathfinder;
