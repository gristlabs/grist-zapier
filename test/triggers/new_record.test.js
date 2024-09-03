const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe('triggers.new_record', () => {
  it('should run', async () => {
    const bundle = {
      authData: { hostname: 'localhost:8080', protocol: 'http', api_key: process.env.TEST_GRIST_API_KEY},
      inputData: { team: 'docs', document: process.env.TEST_GRIST_DOC_ID, table: 'Contacts' },
    };

    const results = await appTester(
      App.triggers['new_record'].operation.perform,
      bundle
    );
    expect(results).toBeDefined();
    // TODO: add more assertions
  });
});
