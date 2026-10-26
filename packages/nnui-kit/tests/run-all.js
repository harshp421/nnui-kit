import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgRoot = path.resolve(__dirname, '..');

const testFiles = [
  'tests/components.test.js',
  'tests/framework-snippets.test.js',
  'tests/theme-customizer.test.js',
  'tests/cli.test.js',
  'tests/track1.test.js',
  'tests/track2.test.js',
  'tests/track3.test.js',
  'tests/track4.test.js',
  'tests/crown-features.test.js',
  'tests/ssr-react.test.js',
  'tests/react19-properties.test.js',
  'tests/intellisense.test.js',
];

console.log('🚀 Running NNUI-KIT Complete Test Suite...\n');

let failed = false;
for (const file of testFiles) {
  try {
    execSync(`node ${file}`, {
      cwd: pkgRoot,
      stdio: 'inherit',
    });
  } catch (err) {
    console.error(`❌ Failed: ${file}`);
    failed = true;
    break;
  }
}

if (failed) {
  console.error('\n❌ Test suite failed.');
  process.exit(1);
} else {
  console.log('\n🌟 ALL TEST SUITES PASSED CLEANLY WITH ZERO ERRORS!');
  process.exit(0);
}
