const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe('creates.update_record', () => {
  it('should run', async () => {
    const bundle = {
      authData: { hostname: 'localhost:8080', protocol: 'http', api_key: process.env.TEST_GRIST_API_KEY},
      inputData: { team: 'docs', document: process.env.TEST_GRIST_DOC_ID, table: 'Contacts',
        record: '5',
        Phone: '555-555-5555',
        First_Name: 'John',
        Last_Name: 'Smith',
      }
    };

    const results = await appTester(
      App.creates['update_record'].operation.perform,
      bundle
    );
    expect(results).toBeDefined();
    // TODO: add more assertions
  });
});
