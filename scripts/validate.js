/**
 * Raise Punch — HTML Structure Validator
 * Checks that the index.html has all required DOM elements for the game to function.
 * Run: node scripts/validate.js
 */

const fs = require('fs');
const path = require('path');

const SRC_FILE = path.join(__dirname, '..', 'src', 'index.html');
let passed = 0;
let failed = 0;

function check(condition, name) {
  if (condition) {
    passed++;
    console.log('  \u2714 ' + name);
  } else {
    failed++;
    console.log('  \u2718 MISSING: ' + name);
  }
}

function validate() {
  if (!fs.existsSync(SRC_FILE)) {
    console.error('ERROR: Source file not found at ' + SRC_FILE);
    process.exit(1);
  }

  const html = fs.readFileSync(SRC_FILE, 'utf8');

  console.log('\n=== Raise Punch Structure Validation ===\n');

  // --- Required DOM IDs ---
  console.log('Required DOM Elements:');
  const requiredIds = [
    'jungleBg', 'firefliesCanvas', 'jungleFg',
    'namingOverlay', 'nameInput', 'previewCanvas',
    'mgModal', 'mgSelector',
    'mgBanana', 'bananaCanvas', 'bananaTimer', 'bananaScore',
    'mgMemory', 'memoryGrid', 'memoryTimer', 'memoryScore',
    'mgDodge', 'dodgeCanvas', 'dodgeTimer', 'dodgeScore',
    'mgGroom', 'groomCanvas', 'groomTimer', 'groomScore',
    'mgResult', 'mgResultText',
    'lcdScreen', 'lcdName', 'lcdStatus',
    'spritesContainer', 'punchCanvas', 'oranCanvas',
    'feedScene', 'zzzFloat', 'sleepTimer',
    'tearL', 'tearR',
    'poopSprite', 'poopStink',
    'actionOverlay', 'actionEmoji',
    'hungerBar', 'happinessBar', 'energyBar', 'loveBar',
    'btnSleep', 'btnClean',
    'piAge', 'piWeight', 'piDay', 'piTime',
    'piMood', 'piMoodIcon',
    'psFed', 'psCuddled', 'psPlayed', 'psCleaned',
    'logList', 'logEmpty'
  ];

  requiredIds.forEach(function(id) {
    check(html.includes('id="' + id + '"'), 'Element #' + id);
  });

  // --- Required CSS Classes ---
  console.log('\nRequired CSS Classes:');
  const requiredClasses = [
    'content-wrap', 'header', 'naming-overlay', 'naming-box',
    'device-container', 'tamagotchi', 'lcd-bezel', 'lcd-screen',
    'stats-container', 'stat-bar', 'stat-fill',
    'actions-container', 'action-btn',
    'pet-info', 'pet-info-grid', 'pet-info-card',
    'tabs-container', 'tabs-nav', 'tab-btn', 'tab-panel',
    'glass-card', 'token-section', 'token-name',
    'modal-overlay', 'modal-box',
    'mg-grid', 'mg-card', 'mg-play',
    'activity-log', 'log-list', 'log-entry',
    'share-row', 'share-btn',
    'action-burst', 'poop-sprite'
  ];

  requiredClasses.forEach(function(cls) {
    check(html.includes(cls), 'Class .' + cls);
  });

  // --- Required JavaScript Functions ---
  console.log('\nRequired JavaScript Functions:');
  const requiredFunctions = [
    'switchTab', 'sharePet', 'startGame', 'save', 'init',
    'beginLoop', 'updateDisp', 'renderSpr', 'setAnim',
    'doAction', 'toggleSleep', 'openMiniGames', 'closeMiniGames',
    'launchMG', 'endMG',
    'addLog', 'renderLog', 'toggleLog',
    'checkPoop', 'spawnPoop', 'cleanPoop', 'updatePoopUI',
    'triggerBurst', 'updateDayTime', 'updatePetInfo',
    'drawPA', 'getPunch', 'getOran',
    'startIdlePlay', 'stopIdlePlay',
    'playPoopScene', 'playShowerScene',
    'playFeedScene', 'playCuddleScene', 'playSleepScene', 'playWakeScene'
  ];

  requiredFunctions.forEach(function(fn) {
    check(html.includes('function ' + fn), 'Function ' + fn + '()');
  });

  // --- Required CSS Custom Properties ---
  console.log('\nRequired CSS Variables:');
  const requiredVars = [
    '--bg', '--primary', '--screen', '--accent',
    '--gold', '--cream', '--text', '--glow'
  ];

  requiredVars.forEach(function(v) {
    check(html.includes(v + ':'), 'Variable ' + v);
  });

  // --- Canvas Elements ---
  console.log('\nCanvas Configuration:');
  const canvasCount = (html.match(/<canvas/g) || []).length;
  check(canvasCount >= 8, 'At least 8 canvas elements (found ' + canvasCount + ')');

  // --- Meta Tags ---
  console.log('\nMeta Tags:');
  check(html.includes('charset="UTF-8"'), 'UTF-8 charset');
  check(html.includes('viewport'), 'Viewport meta');
  check(html.includes('<title>'), 'Title tag');
  check(html.includes('rel="icon"'), 'Favicon');

  // --- Results ---
  console.log('\n=== Results ===');
  console.log('Passed: ' + passed);
  console.log('Failed: ' + failed);
  console.log('Total:  ' + (passed + failed));
  console.log('');

  if (failed === 0) {
    console.log('\u2714 All structure checks passed!');
    process.exit(0);
  } else {
    console.log('\u2718 ' + failed + ' check(s) failed. The game may not function correctly.');
    process.exit(1);
  }
}

validate();
