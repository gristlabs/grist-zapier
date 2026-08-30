const { App, appTester, authData } = require('./helpers');

describe('authentication.test', () => {
  it('returns the user profile when the credential is valid', async () => {
    const bundle = {
      authData,
    };

    const result = await appTester(App.authentication.test, bundle);
    expect(typeof result.email).toBe('string');
    expect(result.email).toMatch(/@/);
    expect(typeof result.name).toBe('string');
  });
});
