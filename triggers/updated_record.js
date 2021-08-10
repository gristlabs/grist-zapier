const perform = async (z, bundle) => {
  const options = {
    url: `https://${bundle.inputData.team}.getgrist.com/api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/data`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.api_key}`,
    },
    params: {
      sort: bundle.inputData.date ? '-' + bundle.inputData.date : '-id',
      limit: 100,
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
        if (key === 'manualSort') continue;
        rec[key] = results[key][i];
      }
      if (bundle.inputData.date) {
        rec.originalId = rec.id;
        rec.id = `${rec.id}-${rec[bundle.inputData.date]}`;
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
        type: 'string',
        label: 'Team',
        dynamic: 'get_all_teams.domain.name',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'document',
        type: 'string',
        label: 'Document',
        dynamic: 'get_all_documents.id.name',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'table',
        type: 'string',
        label: 'Table',
        dynamic: 'get_all_tables.id.name',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'date',
        type: 'string',
        label: 'Date',
        helpText: 'Column containing date when record was last updated.',
        dynamic: 'get_all_columns.id.name',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: { id: 53759 },
    outputFields: [{ key: 'id', label: 'Row ID', type: 'string' }],
  },
  key: 'updated_record',
  noun: 'Record',
  display: {
    label: 'New or Updated Record',
    description: 'Triggers when a Record is updated, or a new Record is added.',
    hidden: false,
    important: true,
  },
};
