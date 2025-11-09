/**
 * Chat bubbles for NPC and player conversations
 */
import { Timer } from './timer';

/**
 * Individual chat bubble
 */
export class Bubble {
  public id: string;
  public element: HTMLElement;
  public timer: Timer;

  /**
   * Create a new chat bubble
   * @param id - Bubble ID (typically entity ID)
   * @param element - DOM element for the bubble
   * @param time - Current game time
   */
  constructor(id: string, element: HTMLElement, time: number) {
    this.id = id;
    this.element = element;
    this.timer = new Timer(5000, time);
  }

  /**
   * Check if bubble's timer has expired
   * @param time - Current game time
   * @returns true if bubble should be removed
   */
  isOver(time: number): boolean {
    return this.timer.isOver(time);
  }

  /**
   * Remove bubble from DOM
   */
  destroy(): void {
    this.element.remove();
  }

  /**
   * Reset bubble timer
   * @param time - Current game time
   */
  reset(time: number): void {
    this.timer.lastTime = time;
  }
}

/**
 * Manager for all chat bubbles in the game
 */
export class BubbleManager {
  public container: HTMLElement;
  public bubbles: Record<string, Bubble>;

  /**
   * Create a new bubble manager
   * @param container - Container element for all bubbles
   */
  constructor(container: HTMLElement) {
    this.container = container;
    this.bubbles = {};
  }

  /**
   * Get a bubble by its ID
   * @param id - Bubble ID
   * @returns Bubble or null if not found
   */
  getBubbleById(id: string): Bubble | null {
    if (id in this.bubbles) {
      return this.bubbles[id];
    }
    return null;
  }

  /**
   * Create or update a chat bubble
   * @param id - Bubble ID (typically entity ID)
   * @param message - Message text (can include HTML)
   * @param time - Current game time
   */
  create(id: string, message: string, time: number): void {
    if (this.bubbles[id]) {
      // Update existing bubble
      this.bubbles[id].reset(time);
      const paragraph = this.bubbles[id].element.querySelector('p');
      if (paragraph) {
        paragraph.innerHTML = message;
      }
    } else {
      // Create new bubble
      const el = document.createElement('div');
      el.id = id;
      el.className = 'bubble';
      el.innerHTML = `<p>${message}</p><div class="thingy"></div>`;
      this.container.appendChild(el);

      this.bubbles[id] = new Bubble(id, el, time);
    }
  }

  /**
   * Update all bubbles, removing expired ones
   * @param time - Current game time
   */
  update(time: number): void {
    const bubblesToDelete: string[] = [];

    Object.values(this.bubbles).forEach((bubble) => {
      if (bubble.isOver(time)) {
        bubble.destroy();
        bubblesToDelete.push(bubble.id);
      }
    });

    bubblesToDelete.forEach((id) => {
      delete this.bubbles[id];
    });
  }

  /**
   * Remove all bubbles
   */
  clean(): void {
    const bubblesToDelete: string[] = [];

    Object.values(this.bubbles).forEach((bubble) => {
      bubble.destroy();
      bubblesToDelete.push(bubble.id);
    });

    bubblesToDelete.forEach((id) => {
      delete this.bubbles[id];
    });

    this.bubbles = {};
  }

  /**
   * Destroy a specific bubble by ID
   * @param id - Bubble ID to destroy
   */
  destroyBubble(id: string): void {
    const bubble = this.getBubbleById(id);

    if (bubble) {
      bubble.destroy();
      delete this.bubbles[id];
    }
  }

  /**
   * Execute a callback for each bubble
   * @param callback - Function to call for each bubble
   */
  forEachBubble(callback: (bubble: Bubble) => void): void {
    Object.values(this.bubbles).forEach((bubble) => {
      callback(bubble);
    });
  }
}

export default BubbleManager;
