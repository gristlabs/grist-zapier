const {getApiOptions} = require('./util');

const perform = async (z, bundle) => {
  const options = getApiOptions(bundle, `api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/data`, {
    method: 'GET',
    params: {
      sort: '-id',
      limit: 100,
    },
  });

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
        type: 'string',
        label: 'Team',
        dynamic: 'get_all_teams.domain.name',
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      {
        key: 'document',
        type: 'string',
        label: 'Document',
        dynamic: 'get_all_documents.id.name',
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      {
        key: 'table',
        type: 'string',
        label: 'Table',
        dynamic: 'get_all_tables.id.name',
        required: true,
        list: false,
        altersDynamicFields: true,
      },
    ],
    outputFields: [{ key: 'id', label: 'Row ID', type: 'integer' }],
    sample: { id: 53759 },
    canPaginate: true,
  },
  key: 'new_record',
  noun: 'Record',
  display: {
    label: 'New Record',
    description: 'Triggers when a new Record is created.',
    hidden: false,
  },
};
