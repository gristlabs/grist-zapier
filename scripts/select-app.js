// Writes .zapierapprc so the CLI acts on the app apps.json maps
// GRIST_ZAPIER_AUTH to. See README.md, "The flavor switch".
const fs = require('fs');
const path = require('path');

const apps = require('../apps.json');
const flavor = process.env.GRIST_ZAPIER_AUTH;
const app = apps[flavor];
if (!app) {
  console.error(`GRIST_ZAPIER_AUTH must be one of: ${Object.keys(apps).join(', ')}`);
  process.exit(1);
}
fs.writeFileSync(path.join(__dirname, '..', '.zapierapprc'), JSON.stringify(app, null, 2) + '\n');
console.log(`Push target: Zapier app ${app.id} (${flavor})`);
