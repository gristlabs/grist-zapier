const { App, appTester, authData, target, dynamicFields } = require('../helpers');

describe('creates.create_record', () => {
  it('creates a record and returns its id', async () => {
    const bundle = {
      authData,
      inputData: { ...target, Phone: '555-555-5555', First_Name: 'John', Last_Name: 'Smith' },
    };
    const result = await appTester(App.creates['create_record'].operation.perform, bundle);
    expect(result).toMatchObject({ id: expect.any(Number) });
    expect(result.id).toBeGreaterThan(0);
  });

  // Zapier merges find_record's `column`/`value` into the bundle when the
  // search-or-create step falls through to the create.
  it('creates a record when driven by the search-or-create step', async () => {
    const bundle = {
      authData,
      inputData: { ...target, column: 'Email', value: 'nobody@example.invalid', Phone: '555-555-5555' },
    };
    const result = await appTester(App.creates['create_record'].operation.perform, bundle);
    expect(result).toMatchObject({ id: expect.any(Number) });
  });

  it('inputFields lists writable columns', async () => {
    const fn = dynamicFields(App.creates['create_record'].operation);
    const fields = await appTester(fn, { authData, inputData: target });
    expect(Array.isArray(fields)).toBe(true);
    expect(fields).toContainEqual(expect.objectContaining({ key: 'Phone' }));
    for (const field of fields) {
      expect(field.key).not.toBe('manualSort');
      expect(field.key.startsWith('gristHelper_')).toBe(false);
    }
  });
});
