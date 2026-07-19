const { App, appTester, authData } = require('../helpers');

describe('triggers.get_all_columns', () => {
  it('returns the table\'s user columns, filtering out manualSort and helpers', async () => {
    const bundle = {
      authData,
      inputData: { team: 'docs', document: process.env.TEST_GRIST_DOC_ID, table: 'Contacts' },
    };

    const results = await appTester(App.triggers['get_all_columns'].operation.perform, bundle);
    expect(Array.isArray(results)).toBe(true);
    const ids = results.map((r) => r.id);
    expect(ids).toEqual(expect.arrayContaining(['Phone', 'Email', 'First_Name', 'Last_Name']));
    expect(ids).not.toContain('manualSort');
    expect(ids.some((id) => id.startsWith('gristHelper_'))).toBe(false);
  });
});
