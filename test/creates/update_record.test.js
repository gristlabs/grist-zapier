const { App, appTester, authData, target, dynamicFields } = require('../helpers');

describe('creates.update_record', () => {
  it('updates a record and returns its id', async () => {
    const bundle = {
      authData,
      inputData: { ...target, record: '5', Phone: '555-555-5555', First_Name: 'John', Last_Name: 'Smith' },
    };
    const result = await appTester(App.creates['update_record'].operation.perform, bundle);
    expect(result).toEqual({ id: 5 });
  });

  // The Record field is search-powered, so find_record's `column`/`value` can
  // ride along in the bundle.
  it('updates a record when the Record field came from a search', async () => {
    const bundle = {
      authData,
      inputData: { ...target, record: '5', column: 'Email', value: 'bob@example.com', Phone: '555-555-5555' },
    };
    const result = await appTester(App.creates['update_record'].operation.perform, bundle);
    expect(result).toEqual({ id: 5 });
  });

  it('inputFields lists writable columns', async () => {
    const fn = dynamicFields(App.creates['update_record'].operation);
    const fields = await appTester(fn, { authData, inputData: target });
    expect(Array.isArray(fields)).toBe(true);
    expect(fields).toContainEqual(expect.objectContaining({ key: 'Phone' }));
    for (const field of fields) {
      expect(field.key).not.toBe('manualSort');
      expect(field.key.startsWith('gristHelper_')).toBe(false);
    }
  });
});
