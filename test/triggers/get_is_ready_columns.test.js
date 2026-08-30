const { App, appTester, authData } = require('../helpers');

describe('triggers.get_is_ready_columns', () => {
  it('returns only columns of type Any or Bool, in {id, name} shape', async () => {
    const bundle = {
      authData,
      inputData: { team: 'docs', document: process.env.TEST_GRIST_DOC_ID, table: 'Contacts' },
    };

    const results = await appTester(App.triggers['get_is_ready_columns'].operation.perform, bundle);
    expect(Array.isArray(results)).toBe(true);
    for (const r of results) {
      expect(r).toEqual({ id: expect.any(String), name: expect.any(String) });
    }
    // Text/Numeric/Date/etc. columns must not appear; we can't easily assert positive without
    // pinning the fixture, but ensure no Text-only column from the Contacts fixture sneaks in.
    const ids = results.map((r) => r.id);
    expect(ids).not.toContain('First_Name');
    expect(ids).not.toContain('Last_Name');
  });
});
