const { App, appTester, authData, target } = require('../helpers');

describe('searches.find_record', () => {
  it('returns rows matching the column filter', async () => {
    const bundle = {
      authData,
      inputData: {
        ...target,
        column: 'Email', value: 'bob@example.com',
      },
    };

    const results = await appTester(App.searches['find_record'].operation.perform, bundle);
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.Email).toBe('bob@example.com');
      expect(typeof r.id).toBe('number');
    }
  });

  it('returns an empty array when no records match', async () => {
    const bundle = {
      authData,
      inputData: {
        ...target,
        column: 'Email', value: 'nobody-with-this-email-exists@example.invalid',
      },
    };

    const results = await appTester(App.searches['find_record'].operation.perform, bundle);
    expect(results).toEqual([]);
  });
});
