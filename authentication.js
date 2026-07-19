// See README.md, "The flavor switch".
const flavor = process.env.GRIST_ZAPIER_AUTH;

const auth = { oauth: require('./lib/auth-oauth'), apikey: require('./lib/auth-apikey') }[flavor];
if (!auth) { throw new Error(`GRIST_ZAPIER_AUTH must be "oauth" or "apikey", got ${JSON.stringify(flavor)}`); }
module.exports = auth;
