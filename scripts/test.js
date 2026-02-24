/**
 * Raise Punch — Game Logic Tests
 * Validates core game mechanics, stat calculations, and decay rates.
 * Run: node scripts/test.js
 */

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    passed++;
    console.log('  \u2714 ' + name);
  } else {
    failed++;
    console.log('  \u2718 FAIL: ' + name);
  }
}

function assertApprox(actual, expected, tolerance, name) {
  const diff = Math.abs(actual - expected);
  assert(diff <= tolerance, name + ' (got ' + actual.toFixed(4) + ', expected ~' + expected + ')');
}

// ============================================================
// Game Constants (mirrored from src/index.html)
// ============================================================
const DECAY_INTERVAL = 3000; // ms per tick
const DECAY_AMOUNT = 0.5;    // base decay per tick
const POOP_INTERVAL = 45000; // ms between poop checks
const POOP_CHANCE = 0.35;    // probability per check
const MAX_WEIGHT = 6.0;      // kg
const MIN_WEIGHT = 0.2;      // kg
const INITIAL_WEIGHT = 0.3;  // kg

// Stat effects per action
const ACTIONS = {
  feed:   { hunger: 20, happiness: 0, energy: 0, love: 0, weight: 0.05 },
  cuddle: { hunger: 0, happiness: 10, energy: 0, love: 20, weight: 0 },
  play:   { hunger: 0, happiness: 20, energy: -10, love: 0, weight: 0 },
  clean:  { hunger: 0, happiness: 10, energy: 0, love: 0, weight: 0 }
};

// Awake decay rates (per tick, multiplied by DECAY_AMOUNT)
const AWAKE_DECAY = {
  hunger: 1.0,      // -0.5 per tick
  happiness: 0.7,   // -0.35 per tick
  energy: 0.4,      // -0.2 per tick
  love: 0.5         // -0.25 per tick
};

// Sleeping decay/recovery rates (per tick, multiplied by DECAY_AMOUNT)
const SLEEP_RATES = {
  hunger: -0.15,     // decays slowly
  happiness: -0.1,   // decays very slowly
  energy: 0.6,       // recovers
  love: -0.08        // decays very slowly
};

// Mood thresholds (based on average of all 4 stats)
const MOOD_TIERS = [
  { min: 85, mood: 'Ecstatic!' },
  { min: 70, mood: 'Happy' },
  { min: 50, mood: 'Content' },
  { min: 35, mood: 'Okay' },
  { min: 20, mood: 'Sad' },
  { min: 1,  mood: 'Miserable' }
];

// ============================================================
// Helper: Create default game state
// ============================================================
function createGameState() {
  return {
    name: 'TestPunch',
    hunger: 80,
    happiness: 80,
    energy: 80,
    love: 80,
    sleeping: false,
    sleepStart: 0,
    weight: INITIAL_WEIGHT,
    feedCount: 0,
    cuddleCount: 0,
    playCount: 0,
    cleanCount: 0,
    poopOnScreen: false,
    lastPoopTime: 0,
    lastUpdate: Date.now(),
    created: Date.now(),
    activityLog: []
  };
}

// ============================================================
// Helper: Apply one decay tick
// ============================================================
function applyDecayTick(gs) {
  if (gs.sleeping) {
    gs.energy = Math.min(100, gs.energy + DECAY_AMOUNT * SLEEP_RATES.energy);
    gs.hunger = Math.max(0, gs.hunger + DECAY_AMOUNT * SLEEP_RATES.hunger);
    gs.happiness = Math.max(0, gs.happiness + DECAY_AMOUNT * SLEEP_RATES.happiness);
    gs.love = Math.max(0, gs.love + DECAY_AMOUNT * SLEEP_RATES.love);
    gs.weight = Math.max(MIN_WEIGHT, gs.weight - 0.001);
  } else {
    gs.hunger = Math.max(0, gs.hunger - DECAY_AMOUNT * AWAKE_DECAY.hunger);
    gs.happiness = Math.max(0, gs.happiness - DECAY_AMOUNT * AWAKE_DECAY.happiness);
    gs.energy = Math.max(0, gs.energy - DECAY_AMOUNT * AWAKE_DECAY.energy);
    gs.love = Math.max(0, gs.love - DECAY_AMOUNT * AWAKE_DECAY.love);
    gs.weight = Math.max(MIN_WEIGHT, gs.weight - 0.003);
    if (gs.poopOnScreen) {
      gs.happiness = Math.max(0, gs.happiness - DECAY_AMOUNT * 0.5);
    }
  }
}

// ============================================================
// Helper: Apply action
// ============================================================
function applyAction(gs, action) {
  const fx = ACTIONS[action];
  if (!fx) return;
  gs.hunger = Math.min(100, Math.max(0, gs.hunger + fx.hunger));
  gs.happiness = Math.min(100, Math.max(0, gs.happiness + fx.happiness));
  gs.energy = Math.min(100, Math.max(0, gs.energy + fx.energy));
  gs.love = Math.min(100, Math.max(0, gs.love + fx.love));
  gs.weight = Math.min(MAX_WEIGHT, gs.weight + fx.weight);
}

// ============================================================
// Helper: Get mood
// ============================================================
function getMood(gs) {
  const avg = (gs.hunger + gs.happiness + gs.energy + gs.love) / 4;
  const anyZero = gs.hunger === 0 || gs.happiness === 0 || gs.energy === 0 || gs.love === 0;
  if (gs.sleeping) return 'Sleeping';
  if (anyZero) return 'Crying';
  for (let i = 0; i < MOOD_TIERS.length; i++) {
    if (avg >= MOOD_TIERS[i].min) return MOOD_TIERS[i].mood;
  }
  return 'Miserable';
}

// ============================================================
// Tests
// ============================================================

console.log('\n=== Raise Punch Game Logic Tests ===\n');

// --- Initial State ---
console.log('Initial State:');
(function() {
  const gs = createGameState();
  assert(gs.hunger === 80, 'Initial hunger is 80');
  assert(gs.happiness === 80, 'Initial happiness is 80');
  assert(gs.energy === 80, 'Initial energy is 80');
  assert(gs.love === 80, 'Initial love is 80');
  assert(gs.weight === INITIAL_WEIGHT, 'Initial weight is ' + INITIAL_WEIGHT + ' kg');
  assert(gs.sleeping === false, 'Not sleeping initially');
  assert(gs.poopOnScreen === false, 'No poop initially');
  assert(gs.feedCount === 0, 'Feed count starts at 0');
  assert(gs.activityLog.length === 0, 'Activity log is empty');
})();

// --- Action Effects ---
console.log('\nAction Effects:');
(function() {
  let gs = createGameState();
  gs.hunger = 50;
  applyAction(gs, 'feed');
  assert(gs.hunger === 70, 'Feed adds +20 hunger');

  gs = createGameState();
  gs.love = 50;
  applyAction(gs, 'cuddle');
  assert(gs.love === 70, 'Cuddle adds +20 love');
  assert(gs.happiness === 90, 'Cuddle adds +10 happiness');

  gs = createGameState();
  gs.happiness = 50;
  gs.energy = 50;
  applyAction(gs, 'play');
  assert(gs.happiness === 70, 'Play adds +20 happiness');
  assert(gs.energy === 40, 'Play costs -10 energy');

  gs = createGameState();
  gs.happiness = 50;
  applyAction(gs, 'clean');
  assert(gs.happiness === 60, 'Clean adds +10 happiness');
})();

// --- Stat Capping ---
console.log('\nStat Capping:');
(function() {
  let gs = createGameState();
  gs.hunger = 95;
  applyAction(gs, 'feed');
  assert(gs.hunger === 100, 'Hunger caps at 100');

  gs = createGameState();
  gs.weight = 5.98;
  applyAction(gs, 'feed');
  assert(gs.weight === MAX_WEIGHT, 'Weight caps at ' + MAX_WEIGHT + ' kg');

  gs = createGameState();
  gs.hunger = 0;
  applyDecayTick(gs);
  assert(gs.hunger === 0, 'Hunger does not go below 0');
})();

// --- Awake Decay ---
console.log('\nAwake Decay (per tick):');
(function() {
  const gs = createGameState();
  const h0 = gs.hunger;
  const hp0 = gs.happiness;
  const e0 = gs.energy;
  const l0 = gs.love;
  applyDecayTick(gs);
  assertApprox(h0 - gs.hunger, 0.5, 0.001, 'Hunger decays by 0.5');
  assertApprox(hp0 - gs.happiness, 0.35, 0.001, 'Happiness decays by 0.35');
  assertApprox(e0 - gs.energy, 0.2, 0.001, 'Energy decays by 0.2');
  assertApprox(l0 - gs.love, 0.25, 0.001, 'Love decays by 0.25');
})();

// --- Sleep Recovery ---
console.log('\nSleep Recovery (per tick):');
(function() {
  const gs = createGameState();
  gs.sleeping = true;
  gs.energy = 30;
  const e0 = gs.energy;
  const h0 = gs.hunger;
  applyDecayTick(gs);
  assertApprox(gs.energy - e0, 0.3, 0.001, 'Energy recovers by 0.3 during sleep');
  assertApprox(h0 - gs.hunger, 0.075, 0.001, 'Hunger decays slowly during sleep');
})();

// --- Poop Penalty ---
console.log('\nPoop Penalty:');
(function() {
  const gs = createGameState();
  gs.poopOnScreen = true;
  const hp0 = gs.happiness;
  applyDecayTick(gs);
  const totalDecay = hp0 - gs.happiness;
  assertApprox(totalDecay, 0.6, 0.001, 'Happiness decays faster with poop (0.35 + 0.25 = 0.6)');
})();

// --- Mood Calculation ---
console.log('\nMood Calculation:');
(function() {
  let gs = createGameState();
  gs.hunger = 90; gs.happiness = 90; gs.energy = 90; gs.love = 90;
  assert(getMood(gs) === 'Ecstatic!', 'Avg 90 = Ecstatic');

  gs.hunger = 75; gs.happiness = 75; gs.energy = 75; gs.love = 75;
  assert(getMood(gs) === 'Happy', 'Avg 75 = Happy');

  gs.hunger = 55; gs.happiness = 55; gs.energy = 55; gs.love = 55;
  assert(getMood(gs) === 'Content', 'Avg 55 = Content');

  gs.hunger = 40; gs.happiness = 40; gs.energy = 40; gs.love = 40;
  assert(getMood(gs) === 'Okay', 'Avg 40 = Okay');

  gs.hunger = 25; gs.happiness = 25; gs.energy = 25; gs.love = 25;
  assert(getMood(gs) === 'Sad', 'Avg 25 = Sad');

  gs.hunger = 10; gs.happiness = 10; gs.energy = 10; gs.love = 10;
  assert(getMood(gs) === 'Miserable', 'Avg 10 = Miserable');

  gs.hunger = 0; gs.happiness = 80; gs.energy = 80; gs.love = 80;
  assert(getMood(gs) === 'Crying', 'Any stat at 0 = Crying');

  gs.sleeping = true; gs.hunger = 50;
  assert(getMood(gs) === 'Sleeping', 'Sleeping overrides mood');
})();

// --- Weight System ---
console.log('\nWeight System:');
(function() {
  let gs = createGameState();
  const w0 = gs.weight;
  applyDecayTick(gs);
  assertApprox(w0 - gs.weight, 0.003, 0.0001, 'Weight decays by 0.003 awake');

  gs = createGameState();
  gs.sleeping = true;
  const w1 = gs.weight;
  applyDecayTick(gs);
  assertApprox(w1 - gs.weight, 0.001, 0.0001, 'Weight decays by 0.001 sleeping');

  gs = createGameState();
  gs.weight = MIN_WEIGHT;
  applyDecayTick(gs);
  assert(gs.weight === MIN_WEIGHT, 'Weight does not go below ' + MIN_WEIGHT + ' kg');
})();

// --- Long-term Simulation ---
console.log('\nLong-term Simulation:');
(function() {
  const gs = createGameState();
  // Simulate 5 minutes of neglect (100 ticks at 3s each)
  for (let i = 0; i < 100; i++) {
    applyDecayTick(gs);
  }
  assert(gs.hunger < 40, 'Hunger drops significantly after 5 min neglect (got ' + gs.hunger.toFixed(1) + ')');
  assert(gs.happiness < 50, 'Happiness drops after 5 min neglect (got ' + gs.happiness.toFixed(1) + ')');
  assert(gs.energy < 70, 'Energy drops after 5 min neglect (got ' + gs.energy.toFixed(1) + ')');
  assert(gs.love < 60, 'Love drops after 5 min neglect (got ' + gs.love.toFixed(1) + ')');

  // Now feed and cuddle to recover
  applyAction(gs, 'feed');
  applyAction(gs, 'cuddle');
  const avg = (gs.hunger + gs.happiness + gs.energy + gs.love) / 4;
  assert(avg > 30, 'Stats recover after feeding + cuddling (avg ' + avg.toFixed(1) + ')');
})();

// --- Results ---
console.log('\n=== Results ===');
console.log('Passed: ' + passed);
console.log('Failed: ' + failed);
console.log('Total:  ' + (passed + failed));
console.log('');

if (failed === 0) {
  console.log('\u2714 All tests passed!');
  process.exit(0);
} else {
  console.log('\u2718 ' + failed + ' test(s) failed.');
  process.exit(1);
}
