/**
 * Game Types and Constants
 * Core type definitions and enums for 8bitQuest
 */

// Message Types for Client-Server Communication
export enum MessageType {
  HELLO = 0,
  WELCOME = 1,
  SPAWN = 2,
  DESPAWN = 3,
  MOVE = 4,
  LOOTMOVE = 5,
  AGGRO = 6,
  ATTACK = 7,
  HIT = 8,
  HURT = 9,
  HEALTH = 10,
  CHAT = 11,
  LOOT = 12,
  EQUIP = 13,
  DROP = 14,
  TELEPORT = 15,
  DAMAGE = 16,
  POPULATION = 17,
  KILL = 18,
  LIST = 19,
  WHO = 20,
  ZONE = 21,
  DESTROY = 22,
  HP = 23,
  BLINK = 24,
  OPEN = 25,
  CHECK = 26,
}

// Entity Type IDs
export enum EntityKind {
  // Player
  WARRIOR = 1,

  // Mobs
  RAT = 2,
  SKELETON = 3,
  GOBLIN = 4,
  OGRE = 5,
  SPECTRE = 6,
  CRAB = 7,
  BAT = 8,
  WIZARD = 9,
  EYE = 10,
  SNAKE = 11,
  SKELETON2 = 12,
  BOSS = 13,
  DEATHKNIGHT = 14,

  // Armors
  FIREFOX = 20,
  CLOTHARMOR = 21,
  LEATHERARMOR = 22,
  MAILARMOR = 23,
  PLATEARMOR = 24,
  REDARMOR = 25,
  GOLDENARMOR = 26,

  // Objects
  FLASK = 35,
  BURGER = 36,
  CHEST = 37,
  FIREPOTION = 38,
  CAKE = 39,

  // NPCs
  GUARD = 40,
  KING = 41,
  OCTOCAT = 42,
  VILLAGEGIRL = 43,
  VILLAGER = 44,
  PRIEST = 45,
  SCIENTIST = 46,
  AGENT = 47,
  RICK = 48,
  NYAN = 49,
  SORCERER = 50,
  BEACHNPC = 51,
  FORESTNPC = 52,
  DESERTNPC = 53,
  LAVANPC = 54,
  CODER = 55,

  // Weapons
  SWORD1 = 60,
  SWORD2 = 61,
  REDSWORD = 62,
  GOLDENSWORD = 63,
  MORNINGSTAR = 64,
  AXE = 65,
  BLUESWORD = 66,
}

// Orientation/Direction
export enum Orientation {
  UP = 1,
  DOWN = 2,
  LEFT = 3,
  RIGHT = 4,
}

// Entity Type Categories
export type EntityType = 'player' | 'mob' | 'weapon' | 'armor' | 'object' | 'npc';

// Entity Kind Information
interface KindInfo {
  kind: EntityKind;
  type: EntityType;
  name: string;
}

// Mapping of entity names to their kind and type
const kindMap: Map<string, KindInfo> = new Map([
  // Player
  ['warrior', { kind: EntityKind.WARRIOR, type: 'player', name: 'warrior' }],

  // Mobs
  ['rat', { kind: EntityKind.RAT, type: 'mob', name: 'rat' }],
  ['skeleton', { kind: EntityKind.SKELETON, type: 'mob', name: 'skeleton' }],
  ['goblin', { kind: EntityKind.GOBLIN, type: 'mob', name: 'goblin' }],
  ['ogre', { kind: EntityKind.OGRE, type: 'mob', name: 'ogre' }],
  ['spectre', { kind: EntityKind.SPECTRE, type: 'mob', name: 'spectre' }],
  ['deathknight', { kind: EntityKind.DEATHKNIGHT, type: 'mob', name: 'deathknight' }],
  ['crab', { kind: EntityKind.CRAB, type: 'mob', name: 'crab' }],
  ['snake', { kind: EntityKind.SNAKE, type: 'mob', name: 'snake' }],
  ['bat', { kind: EntityKind.BAT, type: 'mob', name: 'bat' }],
  ['wizard', { kind: EntityKind.WIZARD, type: 'mob', name: 'wizard' }],
  ['eye', { kind: EntityKind.EYE, type: 'mob', name: 'eye' }],
  ['skeleton2', { kind: EntityKind.SKELETON2, type: 'mob', name: 'skeleton2' }],
  ['boss', { kind: EntityKind.BOSS, type: 'mob', name: 'boss' }],

  // Weapons
  ['sword1', { kind: EntityKind.SWORD1, type: 'weapon', name: 'sword1' }],
  ['sword2', { kind: EntityKind.SWORD2, type: 'weapon', name: 'sword2' }],
  ['axe', { kind: EntityKind.AXE, type: 'weapon', name: 'axe' }],
  ['redsword', { kind: EntityKind.REDSWORD, type: 'weapon', name: 'redsword' }],
  ['bluesword', { kind: EntityKind.BLUESWORD, type: 'weapon', name: 'bluesword' }],
  ['goldensword', { kind: EntityKind.GOLDENSWORD, type: 'weapon', name: 'goldensword' }],
  ['morningstar', { kind: EntityKind.MORNINGSTAR, type: 'weapon', name: 'morningstar' }],

  // Armor
  ['firefox', { kind: EntityKind.FIREFOX, type: 'armor', name: 'firefox' }],
  ['clotharmor', { kind: EntityKind.CLOTHARMOR, type: 'armor', name: 'clotharmor' }],
  ['leatherarmor', { kind: EntityKind.LEATHERARMOR, type: 'armor', name: 'leatherarmor' }],
  ['mailarmor', { kind: EntityKind.MAILARMOR, type: 'armor', name: 'mailarmor' }],
  ['platearmor', { kind: EntityKind.PLATEARMOR, type: 'armor', name: 'platearmor' }],
  ['redarmor', { kind: EntityKind.REDARMOR, type: 'armor', name: 'redarmor' }],
  ['goldenarmor', { kind: EntityKind.GOLDENARMOR, type: 'armor', name: 'goldenarmor' }],

  // Objects
  ['flask', { kind: EntityKind.FLASK, type: 'object', name: 'flask' }],
  ['cake', { kind: EntityKind.CAKE, type: 'object', name: 'cake' }],
  ['burger', { kind: EntityKind.BURGER, type: 'object', name: 'burger' }],
  ['chest', { kind: EntityKind.CHEST, type: 'object', name: 'chest' }],
  ['firepotion', { kind: EntityKind.FIREPOTION, type: 'object', name: 'firepotion' }],

  // NPCs
  ['guard', { kind: EntityKind.GUARD, type: 'npc', name: 'guard' }],
  ['villagegirl', { kind: EntityKind.VILLAGEGIRL, type: 'npc', name: 'villagegirl' }],
  ['villager', { kind: EntityKind.VILLAGER, type: 'npc', name: 'villager' }],
  ['coder', { kind: EntityKind.CODER, type: 'npc', name: 'coder' }],
  ['scientist', { kind: EntityKind.SCIENTIST, type: 'npc', name: 'scientist' }],
  ['priest', { kind: EntityKind.PRIEST, type: 'npc', name: 'priest' }],
  ['king', { kind: EntityKind.KING, type: 'npc', name: 'king' }],
  ['rick', { kind: EntityKind.RICK, type: 'npc', name: 'rick' }],
  ['nyan', { kind: EntityKind.NYAN, type: 'npc', name: 'nyan' }],
  ['sorcerer', { kind: EntityKind.SORCERER, type: 'npc', name: 'sorcerer' }],
  ['agent', { kind: EntityKind.AGENT, type: 'npc', name: 'agent' }],
  ['octocat', { kind: EntityKind.OCTOCAT, type: 'npc', name: 'octocat' }],
  ['beachnpc', { kind: EntityKind.BEACHNPC, type: 'npc', name: 'beachnpc' }],
  ['forestnpc', { kind: EntityKind.FORESTNPC, type: 'npc', name: 'forestnpc' }],
  ['desertnpc', { kind: EntityKind.DESERTNPC, type: 'npc', name: 'desertnpc' }],
  ['lavanpc', { kind: EntityKind.LAVANPC, type: 'npc', name: 'lavanpc' }],
]);

// Reverse mapping for fast lookups
const kindToInfoMap: Map<EntityKind, KindInfo> = new Map(
  Array.from(kindMap.values()).map((info) => [info.kind, info])
);

// Ranked weapons (weakest to strongest)
export const rankedWeapons: readonly EntityKind[] = [
  EntityKind.SWORD1,
  EntityKind.SWORD2,
  EntityKind.AXE,
  EntityKind.MORNINGSTAR,
  EntityKind.BLUESWORD,
  EntityKind.REDSWORD,
  EntityKind.GOLDENSWORD,
];

// Ranked armors (weakest to strongest)
export const rankedArmors: readonly EntityKind[] = [
  EntityKind.CLOTHARMOR,
  EntityKind.LEATHERARMOR,
  EntityKind.MAILARMOR,
  EntityKind.PLATEARMOR,
  EntityKind.REDARMOR,
  EntityKind.GOLDENARMOR,
];

/**
 * Get the rank/power level of a weapon (0 = weakest)
 */
export function getWeaponRank(weaponKind: EntityKind): number {
  return rankedWeapons.indexOf(weaponKind);
}

/**
 * Get the rank/power level of an armor (0 = weakest)
 */
export function getArmorRank(armorKind: EntityKind): number {
  return rankedArmors.indexOf(armorKind);
}

/**
 * Get the entity type for a given kind
 */
export function getEntityType(kind: EntityKind): EntityType | undefined {
  return kindToInfoMap.get(kind)?.type;
}

/**
 * Check if an entity is a player
 */
export function isPlayer(kind: EntityKind): boolean {
  return getEntityType(kind) === 'player';
}

/**
 * Check if an entity is a mob
 */
export function isMob(kind: EntityKind): boolean {
  return getEntityType(kind) === 'mob';
}

/**
 * Check if an entity is an NPC
 */
export function isNpc(kind: EntityKind): boolean {
  return getEntityType(kind) === 'npc';
}

/**
 * Check if an entity is a character (player, mob, or NPC)
 */
export function isCharacter(kind: EntityKind): boolean {
  const type = getEntityType(kind);
  return type === 'player' || type === 'mob' || type === 'npc';
}

/**
 * Check if an entity is armor
 */
export function isArmor(kind: EntityKind): boolean {
  return getEntityType(kind) === 'armor';
}

/**
 * Check if an entity is a weapon
 */
export function isWeapon(kind: EntityKind): boolean {
  return getEntityType(kind) === 'weapon';
}

/**
 * Check if an entity is an object
 */
export function isObject(kind: EntityKind): boolean {
  return getEntityType(kind) === 'object';
}

/**
 * Check if an entity is a chest
 */
export function isChest(kind: EntityKind): boolean {
  return kind === EntityKind.CHEST;
}

/**
 * Check if an entity is an item (weapon, armor, or non-chest object)
 */
export function isItem(kind: EntityKind): boolean {
  return isWeapon(kind) || isArmor(kind) || (isObject(kind) && !isChest(kind));
}

/**
 * Check if an item restores health
 */
export function isHealingItem(kind: EntityKind): boolean {
  return kind === EntityKind.FLASK || kind === EntityKind.BURGER;
}

/**
 * Check if an item is consumable/expendable
 */
export function isExpendableItem(kind: EntityKind): boolean {
  return isHealingItem(kind) || kind === EntityKind.FIREPOTION || kind === EntityKind.CAKE;
}

/**
 * Get entity kind from its string name
 */
export function getKindFromString(name: string): EntityKind | undefined {
  return kindMap.get(name)?.kind;
}

/**
 * Get string name from entity kind
 */
export function getKindAsString(kind: EntityKind): string | undefined {
  return kindToInfoMap.get(kind)?.name;
}

/**
 * Iterate over all entity kinds
 */
export function forEachKind(callback: (kind: EntityKind, name: string) => void): void {
  kindMap.forEach((info) => callback(info.kind, info.name));
}

/**
 * Iterate over all armor kinds
 */
export function forEachArmor(callback: (kind: EntityKind, name: string) => void): void {
  kindMap.forEach((info) => {
    if (info.type === 'armor') {
      callback(info.kind, info.name);
    }
  });
}

/**
 * Iterate over all mob and NPC kinds
 */
export function forEachMobOrNpcKind(callback: (kind: EntityKind, name: string) => void): void {
  kindMap.forEach((info) => {
    if (info.type === 'mob' || info.type === 'npc') {
      callback(info.kind, info.name);
    }
  });
}

/**
 * Iterate over all armor kinds (alias for forEachArmor)
 */
export function forEachArmorKind(callback: (kind: EntityKind, name: string) => void): void {
  forEachArmor(callback);
}

/**
 * Get orientation as a string
 */
export function getOrientationAsString(orientation: Orientation): string {
  switch (orientation) {
    case Orientation.LEFT:
      return 'left';
    case Orientation.RIGHT:
      return 'right';
    case Orientation.UP:
      return 'up';
    case Orientation.DOWN:
      return 'down';
    default:
      return 'unknown';
  }
}

/**
 * Get a random item kind (weapon or armor, excluding starting items)
 */
export function getRandomItemKind(): EntityKind {
  const all = [...rankedWeapons, ...rankedArmors];
  const forbidden = [EntityKind.SWORD1, EntityKind.CLOTHARMOR];
  const itemKinds = all.filter((kind) => !forbidden.includes(kind));
  const i = Math.floor(Math.random() * itemKinds.length);
  return itemKinds[i];
}

/**
 * Get message type as a string for debugging
 */
export function getMessageTypeAsString(type: MessageType): string {
  return MessageType[type] || 'UNKNOWN';
}

// Legacy compatibility exports for gradual migration
export const Types = {
  Messages: MessageType,
  Entities: EntityKind,
  Orientations: Orientation,
  rankedWeapons,
  rankedArmors,
  getWeaponRank,
  getArmorRank,
  isPlayer,
  isMob,
  isNpc,
  isCharacter,
  isArmor,
  isWeapon,
  isObject,
  isChest,
  isItem,
  isHealingItem,
  isExpendableItem,
  getKindFromString,
  getKindAsString,
  forEachKind,
  forEachArmor,
  forEachMobOrNpcKind,
  forEachArmorKind,
  getOrientationAsString,
  getRandomItemKind,
  getMessageTypeAsString,
};

// Default export for backwards compatibility
export default Types;
