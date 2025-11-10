/**
 * Character class for all moving entities (players, mobs, NPCs)
 */
import { Entity } from './entity';
import { Transition } from './transition';
import { Timer } from './timer';
import { EntityKind, Orientation, getOrientationAsString } from '@shared/gametypes';

/**
 * Character class for entities that can move, attack, and interact
 * Base class for Player, Mob, and NPC
 */
export class Character extends Entity {
  // Position and orientation
  public nextGridX: number;
  public nextGridY: number;
  public orientation: Orientation;

  // Speeds (in milliseconds)
  public atkSpeed: number;
  public moveSpeed: number;
  public walkSpeed: number;
  public idleSpeed: number;

  // Pathing
  public movement: Transition;
  public path: number[][] | null;
  public newDestination: { x: number; y: number } | null;
  public destination?: { gridX: number; gridY: number };
  public adjacentTiles: Record<string, any>;
  public step: number;
  public interrupted: boolean;

  // Combat
  public target: Character | null;
  public unconfirmedTarget: Character | null;
  public attackers: Record<number, Character>;
  public attackCooldown: Timer;

  // Health
  public hitPoints: number;
  public maxHitPoints: number;

  // State
  public isDead: boolean;
  public attackingMode: boolean;
  public followingMode: boolean;

  // Hurt effect
  private hurting?: number;

  // Callbacks
  protected request_path_callback: ((x: number, y: number) => number[][]) | null;
  protected start_pathing_callback: ((path: number[][]) => void) | null;
  protected stop_pathing_callback: ((x: number, y: number) => void) | null;
  protected before_step_callback: (() => void) | null;
  protected step_callback: (() => void) | null;
  protected aggro_callback: ((character: Character) => void) | null;
  protected checkaggro_callback: (() => void) | null;
  protected death_callback: (() => void) | null;
  protected hasmoved_callback: ((character: Character) => void) | null;

  /**
   * Create a new character
   * @param id - Entity ID
   * @param kind - Entity kind/type
   */
  constructor(id: number, kind: EntityKind) {
    super(id, kind);

    // Position and orientation
    this.nextGridX = -1;
    this.nextGridY = -1;
    this.orientation = Orientation.DOWN;

    // Speeds
    this.atkSpeed = 50;
    this.moveSpeed = 120;
    this.walkSpeed = 100;
    this.idleSpeed = 450;
    this.setAttackRate(800);

    // Pathing
    this.movement = new Transition();
    this.path = null;
    this.newDestination = null;
    this.adjacentTiles = {};
    this.step = 0;
    this.interrupted = false;

    // Combat
    this.target = null;
    this.unconfirmedTarget = null;
    this.attackers = {};
    this.attackCooldown = new Timer(800);

    // Health
    this.hitPoints = 0;
    this.maxHitPoints = 0;

    // Modes
    this.isDead = false;
    this.attackingMode = false;
    this.followingMode = false;

    // Callbacks
    this.request_path_callback = null;
    this.start_pathing_callback = null;
    this.stop_pathing_callback = null;
    this.before_step_callback = null;
    this.step_callback = null;
    this.aggro_callback = null;
    this.checkaggro_callback = null;
    this.death_callback = null;
    this.hasmoved_callback = null;
  }

  /**
   * Clean up character resources
   */
  override clean(): void {
    this.forEachAttacker((attacker) => {
      attacker.disengage();
      attacker.idle();
    });
    super.clean();
  }

  /**
   * Set maximum hit points and reset current HP to max
   * @param hp - Maximum hit points
   */
  setMaxHitPoints(hp: number): void {
    this.maxHitPoints = hp;
    this.hitPoints = hp;
  }

  /**
   * Set the default animation (idle)
   */
  setDefaultAnimation(): void {
    this.idle();
  }

  /**
   * Check if character has a weapon
   * @returns false (overridden by subclasses)
   */
  hasWeapon(): boolean {
    return false;
  }

  /**
   * Characters have shadows
   */
  override hasShadow(): boolean {
    return true;
  }

  /**
   * Play an animation with orientation support
   * @param animation - Animation name
   * @param speed - Animation speed in ms
   * @param count - Number of times to play
   * @param onEndCount - Callback when count reaches zero
   */
  animate(animation: string, speed: number, count?: number, onEndCount?: () => void): void {
    const oriented = ['atk', 'walk', 'idle'];
    const o = this.orientation;

    // Don't change animation if the character is dying
    if (!(this.currentAnimation && this.currentAnimation.name === 'death')) {
      this.flipSpriteX = false;
      this.flipSpriteY = false;

      if (oriented.indexOf(animation) >= 0) {
        animation += '_' + (o === Orientation.LEFT ? 'right' : getOrientationAsString(o));
        this.flipSpriteX = this.orientation === Orientation.LEFT;
      }

      this.setAnimation(animation, speed, count, onEndCount);
    }
  }

  /**
   * Turn to face a specific orientation
   * @param orientation - Direction to face
   */
  turnTo(orientation: Orientation): void {
    this.orientation = orientation;
    this.idle();
  }

  /**
   * Set the character's orientation
   * @param orientation - Direction to face
   */
  setOrientation(orientation?: Orientation): void {
    if (orientation) {
      this.orientation = orientation;
    }
  }

  /**
   * Play idle animation
   * @param orientation - Optional direction to face
   */
  override idle(orientation?: Orientation): void {
    this.setOrientation(orientation);
    this.animate('idle', this.idleSpeed);
  }

  /**
   * Play attack animation
   * @param orientation - Direction to face when attacking
   */
  hit(orientation?: Orientation): void {
    this.setOrientation(orientation);
    this.animate('atk', this.atkSpeed, 1);
  }

  /**
   * Play walk animation
   * @param orientation - Direction to face when walking
   */
  walk(orientation?: Orientation): void {
    this.setOrientation(orientation);
    this.animate('walk', this.walkSpeed);
  }

  /**
   * Move to a specific grid position
   * @param x - Target grid X
   * @param y - Target grid Y
   * @param callback - Optional callback when destination is reached
   */
  private moveTo_(x: number, y: number, callback?: () => void): void {
    this.destination = { gridX: x, gridY: y };
    this.adjacentTiles = {};

    if (this.isMoving()) {
      this.continueTo(x, y);
    } else {
      const path = this.requestPathfindingTo(x, y);
      this.followPath(path);
    }
  }

  /**
   * Request pathfinding to a destination
   * @param x - Target grid X
   * @param y - Target grid Y
   * @returns Path as array of [x, y] coordinates
   */
  requestPathfindingTo(x: number, y: number): number[][] {
    if (this.request_path_callback) {
      return this.request_path_callback(x, y);
    } else {
      console.error(`${this.id} couldn't request pathfinding to ${x}, ${y}`);
      return [];
    }
  }

  /**
   * Set callback for pathfinding requests
   * @param callback - Pathfinding function
   */
  onRequestPath(callback: (x: number, y: number) => number[][]): void {
    this.request_path_callback = callback;
  }

  /**
   * Set callback for when pathing starts
   * @param callback - Start pathing callback
   */
  onStartPathing(callback: (path: number[][]) => void): void {
    this.start_pathing_callback = callback;
  }

  /**
   * Set callback for when pathing stops
   * @param callback - Stop pathing callback
   */
  onStopPathing(callback: (x: number, y: number) => void): void {
    this.stop_pathing_callback = callback;
  }

  /**
   * Follow a pre-calculated path
   * @param path - Array of [x, y] coordinates
   */
  followPath(path: number[][]): void {
    if (path.length > 1) {
      // Length of 1 means the player has clicked on himself
      this.path = path;
      this.step = 0;

      if (this.followingMode) {
        // Following a character - remove last step to stay adjacent
        path.pop();
      }

      if (this.start_pathing_callback) {
        this.start_pathing_callback(path);
      }
      this.nextStep();
    }
  }

  /**
   * Change destination while already moving
   * @param x - New target grid X
   * @param y - New target grid Y
   */
  continueTo(x: number, y: number): void {
    this.newDestination = { x: x, y: y };
  }

  /**
   * Update movement animation based on current path direction
   */
  updateMovement(): void {
    const p = this.path;
    const i = this.step;

    if (!p) return;

    if (p[i][0] < p[i - 1][0]) {
      this.walk(Orientation.LEFT);
    }
    if (p[i][0] > p[i - 1][0]) {
      this.walk(Orientation.RIGHT);
    }
    if (p[i][1] < p[i - 1][1]) {
      this.walk(Orientation.UP);
    }
    if (p[i][1] > p[i - 1][1]) {
      this.walk(Orientation.DOWN);
    }
  }

  /**
   * Update character's grid position to current path step
   */
  updatePositionOnGrid(): void {
    if (this.path) {
      this.setGridPosition(this.path[this.step][0], this.path[this.step][1]);
    }
  }

  /**
   * Advance to next step in the path
   */
  nextStep(): void {
    let stop = false;

    if (this.isMoving()) {
      if (this.before_step_callback) {
        this.before_step_callback();
      }

      this.updatePositionOnGrid();
      this.checkAggro();

      if (this.interrupted) {
        // Character.stop() has been called
        stop = true;
        this.interrupted = false;
      } else {
        if (this.hasNextStep() && this.path) {
          this.nextGridX = this.path[this.step + 1][0];
          this.nextGridY = this.path[this.step + 1][1];
        }

        if (this.step_callback) {
          this.step_callback();
        }

        if (this.hasChangedItsPath()) {
          const x = this.newDestination!.x;
          const y = this.newDestination!.y;
          const path = this.requestPathfindingTo(x, y);

          this.newDestination = null;
          if (path.length < 2) {
            stop = true;
          } else {
            this.followPath(path);
          }
        } else if (this.hasNextStep()) {
          this.step += 1;
          this.updateMovement();
        } else {
          stop = true;
        }
      }

      if (stop) {
        // Path is complete or has been interrupted
        this.path = null;
        this.idle();

        if (this.stop_pathing_callback) {
          this.stop_pathing_callback(this.gridX, this.gridY);
        }
      }
    }
  }

  /**
   * Set callback to run before each path step
   * @param callback - Before step callback
   */
  onBeforeStep(callback: () => void): void {
    this.before_step_callback = callback;
  }

  /**
   * Set callback to run on each path step
   * @param callback - Step callback
   */
  onStep(callback: () => void): void {
    this.step_callback = callback;
  }

  /**
   * Check if character is currently moving
   */
  isMoving(): boolean {
    return this.path !== null;
  }

  /**
   * Check if there are more steps in the current path
   */
  hasNextStep(): boolean {
    return this.path !== null && this.path.length - 1 > this.step;
  }

  /**
   * Check if the character has changed its destination while moving
   */
  hasChangedItsPath(): boolean {
    return this.newDestination !== null;
  }

  /**
   * Check if character is near another character
   * @param character - Other character
   * @param distance - Maximum distance to be considered near
   */
  isNear(character: Character, distance: number): boolean {
    const dx = Math.abs(this.gridX - character.gridX);
    const dy = Math.abs(this.gridY - character.gridY);
    return dx <= distance && dy <= distance;
  }

  /**
   * Set callback for aggro events
   * @param callback - Aggro callback
   */
  onAggro(callback: (character: Character) => void): void {
    this.aggro_callback = callback;
  }

  /**
   * Set callback for checking aggro
   * @param callback - Check aggro callback
   */
  onCheckAggro(callback: () => void): void {
    this.checkaggro_callback = callback;
  }

  /**
   * Check for aggro (triggered during movement)
   */
  checkAggro(): void {
    if (this.checkaggro_callback) {
      this.checkaggro_callback();
    }
  }

  /**
   * Trigger aggro on another character
   * @param character - Character to aggro
   */
  aggro(character: Character): void {
    if (this.aggro_callback) {
      this.aggro_callback(character);
    }
  }

  /**
   * Set callback for death event
   * @param callback - Death callback
   */
  onDeath(callback: () => void): void {
    this.death_callback = callback;
  }

  /**
   * Turn to face the current target
   */
  lookAtTarget(): void {
    if (this.target) {
      this.turnTo(this.getOrientationTo(this.target));
    }
  }

  /**
   * Move to a specific location (cancels attack/follow)
   * @param x - Target grid X
   * @param y - Target grid Y
   */
  go(x: number, y: number): void {
    if (this.isAttacking()) {
      this.disengage();
    } else if (this.followingMode) {
      this.followingMode = false;
      this.target = null;
    }
    this.moveTo_(x, y);
  }

  /**
   * Follow another entity
   * @param entity - Entity to follow
   */
  follow(entity: Entity | null): void {
    if (entity) {
      this.followingMode = true;
      this.moveTo_(entity.gridX, entity.gridY);
    }
  }

  /**
   * Stop moving
   */
  stop(): void {
    if (this.isMoving()) {
      this.interrupted = true;
    }
  }

  /**
   * Engage in combat with another character
   * @param character - Character to attack
   */
  engage(character: Character): void {
    this.attackingMode = true;
    this.setTarget(character);
    this.follow(character);
  }

  /**
   * Disengage from combat
   */
  disengage(): void {
    this.attackingMode = false;
    this.followingMode = false;
    this.removeTarget();
  }

  /**
   * Check if currently in attacking mode
   */
  isAttacking(): boolean {
    return this.attackingMode;
  }

  /**
   * Get the orientation needed to face a target character
   * Note: Works properly when target is in adjacent non-diagonal position
   * @param character - Target character
   * @returns Orientation to face the target
   */
  getOrientationTo(character: Character): Orientation {
    if (this.gridX < character.gridX) {
      return Orientation.RIGHT;
    } else if (this.gridX > character.gridX) {
      return Orientation.LEFT;
    } else if (this.gridY > character.gridY) {
      return Orientation.UP;
    } else {
      return Orientation.DOWN;
    }
  }

  /**
   * Check if this character is being attacked by another
   * @param character - Potential attacker
   */
  isAttackedBy(character: Character): boolean {
    return character.id in this.attackers;
  }

  /**
   * Register a character as an attacker
   * @param character - Attacking character
   */
  addAttacker(character: Character): void {
    if (!this.isAttackedBy(character)) {
      this.attackers[character.id] = character;
    } else {
      console.error(`${this.id} is already attacked by ${character.id}`);
    }
  }

  /**
   * Unregister a character as an attacker
   * @param character - Attacking character
   */
  removeAttacker(character: Character): void {
    if (this.isAttackedBy(character)) {
      delete this.attackers[character.id];
    } else {
      console.error(`${this.id} is not attacked by ${character.id}`);
    }
  }

  /**
   * Loop through all current attackers
   * @param callback - Function to call for each attacker
   */
  forEachAttacker(callback: (attacker: Character) => void): void {
    Object.values(this.attackers).forEach((attacker) => {
      callback(attacker);
    });
  }

  /**
   * Set the attack target
   * @param character - Target character
   */
  setTarget(character: Character): void {
    if (this.target !== character) {
      if (this.hasTarget()) {
        this.removeTarget(); // Cleanly remove the previous one
      }
      this.unconfirmedTarget = null;
      this.target = character;
    } else {
      console.debug(`${character.id} is already the target of ${this.id}`);
    }
  }

  /**
   * Remove the current attack target
   */
  removeTarget(): void {
    if (this.target) {
      if (this.target instanceof Character) {
        this.target.removeAttacker(this);
      }
      this.target = null;
    }
  }

  /**
   * Check if character has an attack target
   */
  hasTarget(): boolean {
    return this.target !== null;
  }

  /**
   * Mark as waiting to attack a target (pending server confirmation)
   * @param character - Target character
   */
  waitToAttack(character: Character): void {
    this.unconfirmedTarget = character;
  }

  /**
   * Check if waiting to attack a specific character
   * @param character - Target character
   */
  isWaitingToAttack(character: Character): boolean {
    return this.unconfirmedTarget === character;
  }

  /**
   * Check if character can attack at current time
   * @param time - Current game time
   */
  canAttack(time: number): boolean {
    return this.canReachTarget() && this.attackCooldown.isOver(time);
  }

  /**
   * Check if character can reach its current target
   */
  canReachTarget(): boolean {
    return this.hasTarget() && this.target !== null && this.isAdjacentNonDiagonal(this.target);
  }

  /**
   * Handle character death
   */
  die(): void {
    this.removeTarget();
    this.isDead = true;

    if (this.death_callback) {
      this.death_callback();
    }
  }

  /**
   * Set callback for when character has moved
   * @param callback - Has moved callback
   */
  onHasMoved(callback: (character: Character) => void): void {
    this.hasmoved_callback = callback;
  }

  /**
   * Mark character as having moved
   */
  hasMoved(): void {
    this.setDirty();
    if (this.hasmoved_callback) {
      this.hasmoved_callback(this);
    }
  }

  /**
   * Apply hurt visual effect
   */
  hurt(): void {
    this.stopHurting();
    this.sprite = this.hurtSprite;
    this.hurting = window.setTimeout(() => this.stopHurting(), 75);
  }

  /**
   * Remove hurt visual effect
   */
  stopHurting(): void {
    this.sprite = this.normalSprite;
    if (this.hurting !== undefined) {
      clearTimeout(this.hurting);
      this.hurting = undefined;
    }
  }

  /**
   * Set the attack rate (time between attacks)
   * @param rate - Attack cooldown in milliseconds
   */
  setAttackRate(rate: number): void {
    this.attackCooldown = new Timer(rate);
  }
}

export default Character;
