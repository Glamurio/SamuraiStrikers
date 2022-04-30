import { Effect } from "./objects/effect";
import { Item } from "./objects/item";
import { Pickup } from "./objects/pickup";
import { Player } from "./objects/player";
import { Unit } from "./objects/unit";
import { Weapon } from "./objects/weapon";

//// Utility functions

// Clamp number between two values
export const clamp = (num: number, min: number = 0, max: number = 100) => Math.min(Math.max(num, min), max);

// Type Guards
export const isEffect = (tbd: any) => tbd instanceof Effect
export const isItem = (tbd: any) => tbd instanceof Item
export const isWeapon = (tbd: any) => tbd instanceof Weapon
export const isUnit = (tbd: any) => tbd instanceof Unit
export const isPlayer = (tbd: any) => tbd instanceof Player
export const isPickup = (tbd: any) => tbd instanceof Pickup
