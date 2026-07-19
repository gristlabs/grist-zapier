const { App, appTester, authData } = require('../helpers');

describe('triggers.updated_record', () => {
  it('returns rows with numeric id when no date column is configured', async () => {
    const bundle = {
      authData,
      inputData: { team: 'docs', document: process.env.TEST_GRIST_DOC_ID, table: 'Contacts' },
    };

    const results = await appTester(App.triggers['updated_record'].operation.perform, bundle);
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(typeof results[0].id).toBe('number');
    expect(results[0]).toHaveProperty('Email');
    expect(results[0]).not.toHaveProperty('originalId');
  });
});
