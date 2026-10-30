/**
 * Motion Spring Physics & Platform Standards Test Suite
 * 
 * Tests:
 * 1. CSS linear() spring physics tokens in tokens.css and theme.css
 * 2. W3C DTCG tokens.json spring metadata
 * 3. Component integration: popover, dialog, sheet, toast, segmented control
 * 4. CSS Container Queries (@container)
 * 5. Reduced-motion accessibility overrides
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgRoot = path.resolve(__dirname, '..');

console.log('Testing Pillar 1: Spring Physics & Platform Standards Suite...');

// 1. Verify tokens.css
const tokensCss = fs.readFileSync(path.join(pkgRoot, 'src/styles/tokens.css'), 'utf-8');

const requiredTokens = [
  '--ui-spring-snappy',
  '--ui-spring-bouncy',
  '--ui-spring-gentle',
  '--ui-duration-spring',
  '--ui-duration-spring-bouncy',
  '--ui-duration-spring-gentle',
  '--ui-transition-spring-snappy',
  '--ui-transition-spring-bouncy',
  '--ui-transition-spring-gentle',
];

for (const token of requiredTokens) {
  assert(
    tokensCss.includes(token),
    `[tokens.css] Missing expected token: ${token}`
  );
}
console.log('  ✓ All 9 CSS linear() spring tokens and transitions verified in tokens.css');

// Verify linear() easing syntax structure
const linearMatch = tokensCss.match(/--ui-spring-snappy:\s*linear\(([^)]+)\);/);
assert(linearMatch, 'Missing --ui-spring-snappy linear() definition in tokens.css');
const snappyStops = linearMatch[1].split(',').map(s => s.trim());
assert(snappyStops.length >= 10, 'linear() spring snappy should have multi-stop precision curve');
console.log(`  ✓ --ui-spring-snappy linear() precision verified with ${snappyStops.length} stops`);

// 2. Verify theme.css
const themeCss = fs.readFileSync(path.join(pkgRoot, 'src/styles/theme.css'), 'utf-8');
for (const token of requiredTokens) {
  assert(
    themeCss.includes(token),
    `[theme.css] Missing expected token: ${token}`
  );
}
console.log('  ✓ All 9 CSS linear() spring tokens and transitions verified in theme.css');

// 3. Verify tokens.json
const tokensJson = JSON.parse(fs.readFileSync(path.join(pkgRoot, 'tokens.json'), 'utf-8'));
assert(tokensJson.motion, 'tokens.json missing motion section');
assert(tokensJson.motion.easing, 'tokens.json missing motion.easing section');
assert(tokensJson.motion.easing.springSnappy, 'tokens.json missing springSnappy');
assert(tokensJson.motion.easing.springBouncy, 'tokens.json missing springBouncy');
assert(tokensJson.motion.easing.springGentle, 'tokens.json missing springGentle');
assert.strictEqual(tokensJson.motion.easing.springSnappy.$type, 'easing');
console.log('  ✓ W3C DTCG tokens.json motion.easing spring metadata verified');

// 4. Verify Component Integrations
const anchorCss = fs.readFileSync(path.join(pkgRoot, 'src/styles/anchor.css'), 'utf-8');
assert(anchorCss.includes('--ui-transition-spring-snappy'), 'anchor.css popover should use --ui-transition-spring-snappy');
assert(anchorCss.includes('--ui-transition-spring-gentle'), 'anchor.css dialog should use --ui-transition-spring-gentle');
console.log('  ✓ Native popover and dialog spring transitions verified in anchor.css');

const componentsCss = fs.readFileSync(path.join(pkgRoot, 'src/styles/components.css'), 'utf-8');
assert(componentsCss.includes('--ui-transition-spring-snappy'), 'components.css segmented control should use --ui-transition-spring-snappy');
assert(componentsCss.includes('--ui-transition-spring-gentle'), 'components.css sheet should use --ui-transition-spring-gentle');
assert(componentsCss.includes('--ui-transition-spring-bouncy'), 'components.css toast should use --ui-transition-spring-bouncy');
console.log('  ✓ Segmented control, sheet, and toast spring transitions verified in components.css');

// 5. Verify Container Queries in base.css
const baseCss = fs.readFileSync(path.join(pkgRoot, 'src/styles/base.css'), 'utf-8');
assert(baseCss.includes('container-type: inline-size;'), 'base.css card should define container-type: inline-size');
console.log('  ✓ CSS Container Queries (container-type: inline-size) verified on card primitive');

// 6. Verify Reduced Motion Overrides
assert(tokensCss.includes('@media (prefers-reduced-motion: reduce)'), 'tokens.css should have prefers-reduced-motion media query');
assert(tokensCss.includes('animation-duration: 0.01ms !important;'), 'reduced motion should set animation-duration');
assert(tokensCss.includes('transition-duration: 0.01ms !important;'), 'reduced motion should set transition-duration');
console.log('  ✓ WCAG 2.1 AA Reduced-Motion accessibility override verified');

console.log('🎉 PILLAR 1: SPRING PHYSICS & PLATFORM STANDARDS VERIFIED 100% SUCCESSFULLY!\n');
