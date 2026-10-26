import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const cleanEnv = { ...process.env };
delete cleanEnv.npm_lifecycle_event;
delete cleanEnv.npm_lifecycle_script;
delete cleanEnv.npm_command;

console.log('📦 1/3 Building NNUI-KIT Core Library & Registry...');
const buildPkg = spawnSync('npm', ['run', 'build'], {
  cwd: path.join(rootDir, 'packages/nnui-kit'),
  stdio: 'inherit',
  env: cleanEnv,
});
if (buildPkg.status !== 0) {
  process.exit(buildPkg.status || 1);
}

console.log('\n📄 2/3 Building Astro Documentation Static Site...');
const buildDocs = spawnSync('npm', ['run', 'build'], {
  cwd: path.join(rootDir, 'apps/docs'),
  stdio: 'inherit',
  env: cleanEnv,
});
if (buildDocs.status !== 0) {
  process.exit(buildDocs.status || 1);
}

const dashDir = path.join(rootDir, 'apps/dashboard');
if (fs.existsSync(dashDir)) {
  console.log('\n⚡ 3/3 Building React 19 Dashboard Microservice...');
  const buildDash = spawnSync('npm', ['run', 'build'], {
    cwd: dashDir,
    stdio: 'inherit',
    env: cleanEnv,
  });
  if (buildDash.status !== 0) {
    process.exit(buildDash.status || 1);
  }
}

console.log('\n✨ NNUI-KIT BUILD SUCCEEDED!');

