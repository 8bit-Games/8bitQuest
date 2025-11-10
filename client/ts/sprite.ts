/**
 * Sprite management and image loading
 */
import { Animation } from './animation';

/**
 * Animation data from sprite configuration
 */
export interface AnimationData {
  length: number;
  row: number;
}

/**
 * Sprite configuration data
 */
export interface SpriteData {
  id: string;
  width: number;
  height: number;
  offset_x?: number;
  offset_y?: number;
  animations: Record<string, AnimationData>;
}

/**
 * Generated sprite variant (hurt, silhouette)
 */
export interface SpriteVariant {
  image: HTMLCanvasElement;
  isLoaded: boolean;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

/**
 * Position in sprite sheet
 */
interface Position {
  x: number;
  y: number;
}

/**
 * Sprite class for managing sprite images and animations
 */
export class Sprite {
  public name: string;
  public scale: number;
  public isLoaded: boolean;
  public image: HTMLImageElement | null;
  public width: number;
  public height: number;
  public offsetX: number;
  public offsetY: number;

  private id: string;
  private filepath: string;
  private animationData: Record<string, AnimationData>;
  private onload_func: (() => void) | null;
  private whiteSprite: SpriteVariant | null;
  private silhouetteSprite: SpriteVariant | null;

  /**
   * Create a new sprite
   * @param name - Sprite name
   * @param scale - Scale factor (1, 2, or 3)
   * @param spriteData - Sprite configuration data
   */
  constructor(name: string, scale: number, spriteData: SpriteData) {
    this.name = name;
    this.scale = scale;
    this.isLoaded = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.image = null;
    this.onload_func = null;
    this.whiteSprite = null;
    this.silhouetteSprite = null;
    this.id = '';
    this.filepath = '';
    this.width = 0;
    this.height = 0;
    this.animationData = {};

    this.loadJSON(spriteData);
  }

  /**
   * Load sprite configuration from JSON data
   * @param data - Sprite data
   */
  private loadJSON(data: SpriteData): void {
    this.id = data.id;
    this.filepath = `img/${this.scale}/${this.id}.png`;
    this.animationData = data.animations;
    this.width = data.width;
    this.height = data.height;
    this.offsetX = data.offset_x !== undefined ? data.offset_x : -16;
    this.offsetY = data.offset_y !== undefined ? data.offset_y : -16;

    this.load();
  }

  /**
   * Load the sprite image
   */
  private load(): void {
    this.image = new Image();
    this.image.src = this.filepath;

    this.image.onload = () => {
      this.isLoaded = true;

      if (this.onload_func) {
        this.onload_func();
      }
    };

    this.image.onerror = () => {
      console.error(`Failed to load sprite: ${this.filepath}`);
    };
  }

  /**
   * Set a callback to be called when the sprite finishes loading
   * @param callback - Function to call on load
   */
  onLoad(callback: () => void): void {
    this.onload_func = callback;
  }

  /**
   * Create animation objects from sprite data
   * @returns Map of animation name to Animation instance
   */
  createAnimations(): Record<string, Animation> {
    const animations: Record<string, Animation> = {};

    for (const name in this.animationData) {
      const animData = this.animationData[name];
      animations[name] = new Animation(
        name,
        animData.length,
        animData.row,
        this.width,
        this.height
      );
    }

    return animations;
  }

  /**
   * Create a hurt sprite (red-tinted version)
   * Used when entity takes damage
   */
  createHurtSprite(): void {
    if (!this.image) {
      console.warn('Cannot create hurt sprite: image not loaded');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2d context for hurt sprite');
      return;
    }

    const width = this.image.width;
    const height = this.image.height;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(this.image, 0, 0, width, height);

    try {
      const spriteData = ctx.getImageData(0, 0, width, height);
      const data = spriteData.data;

      // Tint sprite red
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255; // R
        data[i + 1] = data[i + 2] = 75; // G, B
      }

      ctx.putImageData(spriteData, 0, 0);

      this.whiteSprite = {
        image: canvas,
        isLoaded: true,
        offsetX: this.offsetX,
        offsetY: this.offsetY,
        width: this.width,
        height: this.height,
      };
    } catch (error) {
      console.error(`Error creating hurt sprite for: ${this.name}`, error);
    }
  }

  /**
   * Get the hurt sprite variant
   * @returns Hurt sprite or null if not created
   */
  getHurtSprite(): SpriteVariant | null {
    return this.whiteSprite;
  }

  /**
   * Create a silhouette sprite (outline effect)
   * Used for target selection, etc.
   */
  createSilhouette(): void {
    if (!this.image) {
      console.warn('Cannot create silhouette: image not loaded');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2d context for silhouette');
      return;
    }

    const width = this.image.width;
    const height = this.image.height;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(this.image, 0, 0, width, height);

    const sourceData = ctx.getImageData(0, 0, width, height).data;
    const finalData = ctx.getImageData(0, 0, width, height);
    const fdata = finalData.data;

    /**
     * Get pixel index from x,y coordinates
     */
    const getIndex = (x: number, y: number): number => {
      return (width * (y - 1) + x - 1) * 4;
    };

    /**
     * Get x,y position from pixel index
     */
    const getPosition = (i: number): Position => {
      i = i / 4 + 1;
      const x = i % width;
      const y = (i - x) / width + 1;
      return { x, y };
    };

    /**
     * Check if pixel is blank (transparent)
     */
    const isBlankPixel = (i: number): boolean => {
      if (i < 0 || i >= sourceData.length) {
        return true;
      }
      return (
        sourceData[i] === 0 &&
        sourceData[i + 1] === 0 &&
        sourceData[i + 2] === 0 &&
        sourceData[i + 3] === 0
      );
    };

    /**
     * Check if pixel has an adjacent non-blank pixel
     */
    const hasAdjacentPixel = (i: number): boolean => {
      const pos = getPosition(i);

      // Check right
      if (pos.x < width && !isBlankPixel(getIndex(pos.x + 1, pos.y))) {
        return true;
      }
      // Check left
      if (pos.x > 1 && !isBlankPixel(getIndex(pos.x - 1, pos.y))) {
        return true;
      }
      // Check down
      if (pos.y < height && !isBlankPixel(getIndex(pos.x, pos.y + 1))) {
        return true;
      }
      // Check up
      if (pos.y > 1 && !isBlankPixel(getIndex(pos.x, pos.y - 1))) {
        return true;
      }

      return false;
    };

    // Create outline by coloring blank pixels adjacent to non-blank ones
    for (let i = 0; i < sourceData.length; i += 4) {
      if (isBlankPixel(i) && hasAdjacentPixel(i)) {
        fdata[i] = fdata[i + 1] = 255; // Yellow outline
        fdata[i + 2] = 150;
        fdata[i + 3] = 150;
      }
    }

    ctx.putImageData(finalData, 0, 0);

    this.silhouetteSprite = {
      image: canvas,
      isLoaded: true,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Get the silhouette sprite variant
   * @returns Silhouette sprite or null if not created
   */
  getSilhouette(): SpriteVariant | null {
    return this.silhouetteSprite;
  }

  /**
   * Check if sprite has finished loading
   */
  hasLoaded(): boolean {
    return this.isLoaded;
  }
}

export default Sprite;
