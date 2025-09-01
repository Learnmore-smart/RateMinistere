//src\app\astrarena\training\battleData.js
import { ShootingStar, CircleHalfTilt, Speedometer, Heart, Bomb, Lightning, RocketLaunch, HourglassMedium, ShieldCheck, Sword } from '@phosphor-icons/react';

export const TANK_STATS = {
    "0.0": {
        damage: 35, chargeTime: 2.0, health: 150, speed: 6, range: 5,
        bullets: 3, // Standard tank - balanced bullets
        name: "Upgrade0.0",
        specialAttacks: [
            { name: "Power Shot", damageMultiplier: 1.5, rangeMultiplier: 1, effect: null },
            { name: "Quick Reload", chargeTimeMultiplier: 0.5, duration: 3, effect: null },
            { name: "Armor Up", healthMultiplier: 1.2, duration: 10, effect: "armor" }
        ]
    },
    "1.1": {
        damage: 15, chargeTime: 1.0, health: 120, speed: 8, range: 4,
        bullets: 5, // Rapidfire - more bullets to compensate for low damage
        name: "Upgrade1.1",
        specialAttacks: [
            { name: "Overdrive", chargeTimeMultiplier: 0.5, duration: 5, effect: null },
            { name: "Flurry", bulletCount: 5, effect: "flurry" },
            { name: "Evasive Maneuvers", speedMultiplier: 1.3, duration: 8, effect: null }
        ]
    },
    "1.2": {
        damage: 40, chargeTime: 3.0, health: 180, speed: 4, range: 8,
        bullets: 2, // Sniper - fewer bullets due to high damage and range
        name: "Upgrade1.2",
        specialAttacks: [
            { name: "Piercing Shot", effect: "pierce" },
            { name: "Long Shot", rangeMultiplier: 2, effect: null },
            { name: "Steady Aim", damageMultiplier: 2, canMove: false, effect: null }
        ]
    },
    "1.3": {
        damage: 30, chargeTime: 1.8, health: 140, speed: 7, range: 6,
        bullets: 3, // Scatter -  moderate bullets
        name: "Upgrade1.3",
        specialAttacks: [
            { name: "Cluster Bomb", effect: "cluster" },
            { name: "Wide Spread", effect: "widespread" },
            { name: "Concussive Blast", effect: "knockback" }
        ]
    },
    "2.1": {
        damage: 10, chargeTime: 0.5, health: 100, speed: 9, range: 3,
        bullets: 4, // Kamikaze -  more bullets, encourages aggressive play
        name: "Upgrade2.1",
        specialAttacks: [
            { name: "Self-Destruct", damage: 200, effect: "selfdestruct", selfDamage: 80 },
            { name: "Speed Boost", speedMultiplier: 2, duration: 4, effect: null },
            { name: "Last Stand", effect: "invulnerable", duration: 3, healthThreshold: 0.2 }
        ]
    },
    "2.2": {
        damage: 60, chargeTime: 4.0, health: 200, speed: 3, range: 10,
        bullets: 2, // Artillery - very few bullets, high damage, long range
        name: "Upgrade2.2",
        specialAttacks: [
            { name: "Barrage", shotCount: 3, effect: "barrage" },
            { name: "Incendiary Shells", effect: "fire", damageOverTime: 10, duration: 5 },
            { name: "Smoke Screen", effect: "smoke" }
        ]
    },
    "2.3": {
        damage: 20, chargeTime: 1.5, health: 160, speed: 5, range: 7,
        bullets: 3, // Support - moderate bullets
        name: "Upgrade2.3",
        specialAttacks: [
            { name: "Healing Aura", healAmount: 30, duration: 5, effect: "heal" },
            { name: "Shield Projector", shieldAmount: 50, duration: 8, effect: "shield" },
            { name: "Repair Drone", healAmount: 5, duration: 10, effect: "repair" } //heals self
        ]
    },
    "3.1": {
        damage: 35, chargeTime: 2.2, health: 170, speed: 6, range: 6,
        bullets: 3, // Piercer - moderate bullets.
        name: "Upgrade3.1",
        specialAttacks: [
            { name: "Penetrating Round", effect: "penetrate" },
            { name: "Armor Shredder", effect: "armor_shred" },
            { name: "Focused Fire", effect: 'accuracy' }
        ]
    },
    "3.2": {
        damage: 28, chargeTime: 1.6, health: 130, speed: 8, range: 5,
        bullets: 4, // Dasher - slightly more bullets
        name: "Upgrade3.2",
        specialAttacks: [
            { name: "Triple Dash", dashCount: 3, effect: "triple_dash" },
            { name: "Impact Dash", damage: 20, effect: "impact_dash" },
            { name: "Afterimage", effect: "decoy" }

        ]
    },
    "3.3": {
        damage: 5, chargeTime: 0.2, health: 80, speed: 10, range: 4,
        bullets: 7, // Swarmer -  most bullets, very low damage
        name: "Upgrade3.3",
        specialAttacks: [
            { name: "Multiply", projectileMultiplier: 2, duration: 5, effect: null },
            { name: "Frenzy", chargeTimeMultiplier: 0.5, speedMultiplier: 1.5, duration: 3, effect: null },
            { name: "Divide", effect: "split" }
        ]
    }
};

export const TANK_COLORS = {
    "Upgrade0.0": "blue",
    "Upgrade1.1": "blue",
    "Upgrade1.2": "blue",
    "Upgrade1.3": "purple",
    "Upgrade2.1": "gray",
    "Upgrade2.2": "green",
    "Upgrade2.3": "blue",
    "Upgrade3.1": "purple",
    "Upgrade3.2": "gray",
    "Upgrade3.3": "green",
};


export const SPECIAL_ICONS = {
    "mine": <Bomb size={20} weight="duotone" color={"#333232"} />,
    "radar": <Lightning size={20} weight="duotone" color={"#FFD700"} />,
    "rapidfire": <Lightning size={20} weight="duotone" color={"#00FF00"} />,
    "sniper": <RocketLaunch size={20} weight="duotone" color={"#FF0000"} />,
    "scatter": <ShootingStar size={20} weight="duotone" color={"#FFA500"} />,
    "kamikaze": <Bomb size={20} weight="fill" color={"#8B0000"} />,
    "artillery": <RocketLaunch size={20} weight="fill" color={"#A9A9A9"} />,
    "support": <ShieldCheck size={20} weight="fill" color={"#00CED1"} />,
    "piercing": <Sword size={20} weight="fill" color={"#808080"} />,
    "dash": <Speedometer size={20} weight="fill" color={"#00BFFF"} />,
    "swarm": <ShootingStar size={20} weight="duotone" color={"#FFFF00"} />,
    "default": <CircleHalfTilt size={20} weight="duotone" color={"#7B7B7A"} />
};