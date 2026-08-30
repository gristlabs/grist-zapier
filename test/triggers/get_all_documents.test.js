const { App, appTester, authData } = require('../helpers');

describe('triggers.get_all_documents', () => {
  it('returns the team\'s documents including the test fixture', async () => {
    const bundle = {
      authData,
      inputData: { team: 'docs' },
    };

    const results = await appTester(App.triggers['get_all_documents'].operation.perform, bundle);
    expect(Array.isArray(results)).toBe(true);
    expect(results).toContainEqual(expect.objectContaining({ id: process.env.TEST_GRIST_DOC_ID }));
  });
});
