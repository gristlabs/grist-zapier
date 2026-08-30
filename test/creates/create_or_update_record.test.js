const { App, appTester, authData, target, dynamicFields } = require('../helpers');

describe('creates.create_or_update_record', () => {
  it('runs the upsert', async () => {
    const bundle = {
      authData,
      inputData: {
        ...target,
        'require.Email': 'bob@example.com',
        'fields.Phone': '555-555-5555',
        'fields.First_Name': 'John',
        'fields.Last_Name': 'Smith',
      },
    };
    const result = await appTester(App.creates['create_or_update_record'].operation.perform, bundle);
    expect(result).toEqual({ status: 'ok' });
  });

  it('inputFields builds require.* and fields.* entries', async () => {
    const fn = dynamicFields(App.creates['create_or_update_record'].operation);
    const fields = await appTester(fn, { authData, inputData: { ...target, matchFields: ['Email'] } });
    expect(Array.isArray(fields)).toBe(true);
    expect(fields).toContainEqual(expect.objectContaining({ key: 'require.Email' }));
    expect(fields).toContainEqual(expect.objectContaining({ key: 'fields.Phone' }));
    for (const field of fields) {
      const colId = field.key.split('.')[1];
      expect(colId).not.toBe('manualSort');
      expect(colId.startsWith('gristHelper_')).toBe(false);
    }
  });
});
