const perform = async (z, bundle) => {
  const options = {
    url: `https://${bundle.inputData.team}.getgrist.com/api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/data`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.api_key}`,
    },
    params: {
      sort: '-id',
      limit: 100,
      filter: JSON.stringify({
        [bundle.inputData.column]: [bundle.inputData.value],
      }),
    },
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    // You can do any parsing you need for results here before returning them
    const ids = results.id;
    const recs = [];
    const keys = Object.keys(results);
    for (let i = 0; i < ids.length; i++) {
      const rec = { id: ids[i] };
      for (const key of keys) {
        if (key === 'id' || key === 'manualSort') continue;
        rec[key] = results[key][i];
      }
      recs.push(rec);
    }
    return recs;
  });
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'team',
        label: 'Team',
        type: 'string',
        dynamic: 'get_all_teams.domain.name',
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      {
        key: 'document',
        label: 'Document',
        type: 'string',
        dynamic: 'get_all_documents.id.name',
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      {
        key: 'table',
        label: 'Table',
        type: 'string',
        dynamic: 'get_all_tables.id.name',
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      {
        key: 'column',
        label: 'Column',
        type: 'string',
        dynamic: 'get_all_columns.id.name',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'value',
        label: 'Value',
        type: 'string',
        helpText:
          'Watch out - only string values can be matched currently!  Workaround: add a formula column in your table to convert to a string.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: { id: 53759 },
    outputFields: [{ key: 'id', label: 'ID', type: 'number' }],
  },
  key: 'find_record',
  noun: 'Record',
  display: {
    label: 'Find Record',
    description: 'Finds a Record in a Table',
    hidden: false,
    important: true,
  },
};
