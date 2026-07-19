// Runs after `zapier-platform push`: sets GRIST_ZAPIER_AUTH on the pushed
// version and checks the flavor's other env vars are there. Those have
// per-app values, so filling them in stays manual.
const { execSync } = require('child_process');

const { version } = require('../package.json');

// Env vars each flavor needs at runtime, beyond GRIST_ZAPIER_AUTH itself.
const REQUIRED_ENV = { oauth: ['GRIST_HOST', 'CLIENT_ID', 'CLIENT_SECRET'], apikey: [] };

// select-app.js has already rejected an unknown flavor by the time we run.
const flavor = process.env.GRIST_ZAPIER_AUTH;

function run(cmd, opts) {
  try {
    return execSync(cmd, { encoding: 'utf8', ...opts });
  } catch {
    process.exit(1);    // the CLI already printed its error
  }
}

const out = run(`zapier-platform env:get ${version} --format=json`);
const start = out.indexOf('[');
const rows = start === -1 ? [] : JSON.parse(out.slice(start, out.lastIndexOf(']') + 1));
const env = Object.fromEntries(rows.map(({ Key, Value }) => [Key, Value]));

if (env.GRIST_ZAPIER_AUTH !== flavor) {
  run(`zapier-platform env:set ${version} GRIST_ZAPIER_AUTH=${flavor}`, { stdio: 'inherit' });
}

const missing = REQUIRED_ENV[flavor].filter((key) => !env[key]);
if (missing.length) {
  console.error(`Version ${version} is missing env vars: ${missing.join(', ')}. Set them before promoting:`);
  console.error(`  zapier-platform env:set ${version} ${missing.map((k) => `${k}=...`).join(' ')}`);
  process.exit(1);
}
console.log(`Env vars OK for version ${version} (${flavor}).`);
