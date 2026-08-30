const { App, appTester, authData } = require('../helpers');

describe('triggers.get_all_tables', () => {
  it('returns the document\'s tables in {id, name} shape', async () => {
    const bundle = {
      authData,
      inputData: { team: 'docs', document: process.env.TEST_GRIST_DOC_ID },
    };

    const results = await appTester(App.triggers['get_all_tables'].operation.perform, bundle);
    expect(Array.isArray(results)).toBe(true);
    expect(results).toContainEqual({ id: 'Contacts', name: 'Contacts' });
  });
});
