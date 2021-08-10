const perform = async (z, bundle) => {
  const options = {
    url: `https://${bundle.inputData.team}.getgrist.com/api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/data`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.api_key}`,
    },
    params: {
      limit: 1,
    },
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    // You can do any parsing you need for results here before returning them
    const ids = results.id;
    const recs = [];
    const keys = Object.keys(results).sort();
    for (const key of keys) {
      if (
        key === 'id' ||
        key === 'manualSort' ||
        key.startsWith('gristHelper_Display')
      ) {
        continue;
      }
      recs.push({ id: key, name: key });
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
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'document',
        type: 'string',
        label: 'Document',
        dynamic: 'get_all_documents.id.name',
        required: false,
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
    ],
    outputFields: [
      { key: 'id', label: 'ID', type: 'string' },
      { key: 'name', label: 'Name', type: 'string' },
    ],
  },
  key: 'get_all_columns',
  noun: 'Column',
  display: {
    label: 'Get All Columns',
    description: 'Get all Columns in a Table',
    hidden: true,
    important: false,
  },
};
