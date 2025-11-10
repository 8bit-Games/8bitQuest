/**
 * Camera system for viewport management
 */

/**
 * Minimal interface for entity position
 */
export interface CameraEntity {
  x: number;
  y: number;
  gridX: number;
  gridY: number;
}

/**
 * Minimal interface for renderer
 */
export interface CameraRenderer {
  mobile: boolean;
  tilesize: number;
}

/**
 * Camera class for managing the game viewport
 * Handles position, scrolling, and visibility calculations
 */
export class Camera {
  public renderer: CameraRenderer;
  public x: number;
  public y: number;
  public gridX: number;
  public gridY: number;
  public offset: number;
  public gridW: number;
  public gridH: number;

  /**
   * Create a new camera
   * @param renderer - Renderer instance
   */
  constructor(renderer: CameraRenderer) {
    this.renderer = renderer;
    this.x = 0;
    this.y = 0;
    this.gridX = 0;
    this.gridY = 0;
    this.offset = 0.5;
    this.gridW = 0;
    this.gridH = 0;
    this.rescale();
  }

  /**
   * Rescale camera viewport based on device type
   */
  rescale(): void {
    const factor = this.renderer.mobile ? 1 : 2;

    this.gridW = 15 * factor;
    this.gridH = 7 * factor;

    console.debug('---------');
    console.debug(`Factor: ${factor}`);
    console.debug(`W: ${this.gridW} H: ${this.gridH}`);
  }

  /**
   * Set camera position in pixel coordinates
   * @param x - X position in pixels
   * @param y - Y position in pixels
   */
  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;

    this.gridX = Math.floor(x / 16);
    this.gridY = Math.floor(y / 16);
  }

  /**
   * Set camera position in grid coordinates
   * @param x - X position in grid cells
   * @param y - Y position in grid cells
   */
  setGridPosition(x: number, y: number): void {
    this.gridX = x;
    this.gridY = y;

    this.x = this.gridX * 16;
    this.y = this.gridY * 16;
  }

  /**
   * Center camera on an entity
   * @param entity - Entity to focus on
   */
  lookAt(entity: CameraEntity): void {
    const r = this.renderer;
    const x = Math.round(entity.x - Math.floor(this.gridW / 2) * r.tilesize);
    const y = Math.round(entity.y - Math.floor(this.gridH / 2) * r.tilesize);

    this.setPosition(x, y);
  }

  /**
   * Execute callback for each visible grid position
   * @param callback - Function to call for each position
   * @param extra - Extra tiles to include around visible area
   */
  forEachVisiblePosition(callback: (x: number, y: number) => void, extra?: number): void {
    const extraTiles = extra || 0;
    const maxY = this.gridY + this.gridH + extraTiles * 2;
    const maxX = this.gridX + this.gridW + extraTiles * 2;

    for (let y = this.gridY - extraTiles; y < maxY; y += 1) {
      for (let x = this.gridX - extraTiles; x < maxX; x += 1) {
        callback(x, y);
      }
    }
  }

  /**
   * Check if an entity is visible in the camera viewport
   * @param entity - Entity to check
   * @returns true if entity is visible
   */
  isVisible(entity: CameraEntity): boolean {
    return this.isVisiblePosition(entity.gridX, entity.gridY);
  }

  /**
   * Check if a grid position is visible in the camera viewport
   * @param x - Grid X position
   * @param y - Grid Y position
   * @returns true if position is visible
   */
  isVisiblePosition(x: number, y: number): boolean {
    return (
      y >= this.gridY &&
      y < this.gridY + this.gridH &&
      x >= this.gridX &&
      x < this.gridX + this.gridW
    );
  }

  /**
   * Focus camera on an entity with snapping to grid sections
   * @param entity - Entity to focus on
   */
  focusEntity(entity: CameraEntity): void {
    const w = this.gridW - 2;
    const h = this.gridH - 2;
    const x = Math.floor((entity.gridX - 1) / w) * w;
    const y = Math.floor((entity.gridY - 1) / h) * h;

    this.setGridPosition(x, y);
  }
}

export default Camera;
