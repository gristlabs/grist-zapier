const { App, appTester, authData } = require('../helpers');

describe('triggers.new_record', () => {
  it('returns rows sorted by -id with id flattened alongside fields', async () => {
    const bundle = {
      authData,
      inputData: { team: 'docs', document: process.env.TEST_GRIST_DOC_ID, table: 'Contacts' },
    };

    const results = await appTester(App.triggers['new_record'].operation.perform, bundle);
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('Email');
    expect(results[0]).not.toHaveProperty('manualSort');
    // Sorted descending by id.
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].id).toBeGreaterThanOrEqual(results[i].id);
    }
  });
});
