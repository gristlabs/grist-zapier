const { App, appTester, authData } = require('../helpers');

describe('triggers.get_all_teams', () => {
  it('returns the user\'s teams including "docs"', async () => {
    const bundle = {
      authData,
      inputData: {},
    };

    const results = await appTester(App.triggers['get_all_teams'].operation.perform, bundle);
    expect(Array.isArray(results)).toBe(true);
    expect(results).toContainEqual(expect.objectContaining({ domain: 'docs' }));
  });
});
