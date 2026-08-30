// Writes .zapierapprc so the CLI acts on the app apps.json maps
// GRIST_ZAPIER_AUTH to. See README.md, "The flavor switch".
const fs = require('fs');
const path = require('path');

// Load .env if present, so a self-hosted build can point the push at its own
// Zapier app via ZAPIER_APP_ID/ZAPIER_APP_KEY. Node >=22 built-in.
try { process.loadEnvFile(); } catch { /* no .env: fall back to apps.json */ }

const apps = require('../apps.json');
const flavor = process.env.GRIST_ZAPIER_AUTH;

// A self-hosted build targets its own app; everyone else uses apps.json.
if (process.env.ZAPIER_APP_ID && !process.env.ZAPIER_APP_KEY) {
  console.error('ZAPIER_APP_KEY must be set alongside ZAPIER_APP_ID');
  process.exit(1);
}
const app = process.env.ZAPIER_APP_ID
  ? { id: Number(process.env.ZAPIER_APP_ID), key: process.env.ZAPIER_APP_KEY }
  : apps[flavor];
if (!app) {
  console.error(`GRIST_ZAPIER_AUTH must be one of: ${Object.keys(apps).join(', ')}`);
  process.exit(1);
}
fs.writeFileSync(path.join(__dirname, '..', '.zapierapprc'), JSON.stringify(app, null, 2) + '\n');
console.log(`Push target: Zapier app ${app.id} (${flavor})`);
