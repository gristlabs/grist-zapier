const { pickFields, flattenRecords } = require('../lib/records');

describe('records.pickFields', () => {
  it('keeps column values', () => {
    expect(pickFields({ Phone: '555', First_Name: 'John' }))
      .toEqual({ Phone: '555', First_Name: 'John' });
  });

  it('drops the step\'s own configuration fields', () => {
    expect(pickFields({ team: 'docs', document: 'abc', table: 'T', record: '5', Phone: '555' }))
      .toEqual({ Phone: '555' });
  });

  // Zapier merges find_record's fields into the bundle for search-or-create
  // steps and search-powered dropdowns. Sending them on as record fields makes
  // Grist reject the request with an unknown-column error, so the create half
  // of "Find or Create Record" fails exactly when the search misses.
  it('drops find_record\'s column/value fields', () => {
    expect(pickFields({ document: 'abc', table: 'T', column: 'Email', value: 'a@b.c', Phone: '555' }))
      .toEqual({ Phone: '555' });
  });
});

describe('records.flattenRecords', () => {
  it('lifts the row id alongside its fields', () => {
    expect(flattenRecords([{ id: 2, fields: { Email: 'a@b.c' } }]))
      .toEqual([{ id: 2, Email: 'a@b.c' }]);
  });
});
