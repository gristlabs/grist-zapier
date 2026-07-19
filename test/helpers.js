const zapier = require('zapier-platform-core');

const App = require('../index');

zapier.tools.env.inject();

const appTester = zapier.createAppTester(App);

// The local Grist that `npm run start:grist` serves the fixtures from.
const authData = { hostname: 'localhost:8080', protocol: 'http', api_key: process.env.TEST_GRIST_API_KEY };
const target = { team: 'docs', document: process.env.TEST_GRIST_DOC_ID, table: 'Contacts' };

const listWebhooks = () => appTester(async (z, bundle) => {
  const response = await z.request({
    url: `/api/docs/${bundle.inputData.document}/webhooks`,
    method: 'GET',
  });
  return response.data.webhooks;
}, { authData, inputData: target });

// Actions declare their dynamic fields as a function among static field objects.
const dynamicFields = (operation) => operation.inputFields.find((f) => typeof f === 'function');

module.exports = { App, appTester, authData, target, listWebhooks, dynamicFields };
