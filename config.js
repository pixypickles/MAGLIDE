export const CFG = {
  world: { width: 960, height: 540, margin: 42 },
  fighter: {
    maxHp: 100,
    moveSpeed: 175,
    hoverAmplitude: 5,
    hoverSpeed: 2.4,
    radius: 25,
    recoverRiseSpeed: 560
  },
  shot: {
    damage: 5,
    cooldown: 0.28,
    speed: 340,
    forwardStartSpeed: 510,
    backwardStartSpeed: 160,
    acceleration: 360,
    radius: 8,
    life: 2.4
  },
  kick: {
    damage: 22,
    cooldown: 0.72,
    range: 95,
    activeTime: 0.18,
    duration: 0.38,
    knockdown: 32
  },
  dash: {
    damage: 12,
    cooldown: 1.0,
    duration: 0.52,
    speed: 690,
    radius: 34
  },
  guard: {
    damageScale: 0.28,
    justWindow: 0.12,
    reflectSpeed: 480
  },
  hit: {
    lightDrop: 9,
    heavyDrop: 42,
    fallOutThreshold: 20,
    respawnDelay: 0.24,
    invincibleTime: 0.42
  }
};
