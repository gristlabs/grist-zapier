const {getApiOptions} = require('./util');

const perform = async (z, bundle) => {
  const options = getApiOptions(bundle, `api/docs/${bundle.inputData.document}/tables/_grist_Tables/data`, {
    method: 'GET',
    params: {},
  });

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return results.tableId.map((t) => ({ id: t, name: `${t} table` }));
  });
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'document',
        type: 'string',
        label: 'Document',
        dynamic: 'get_all_documents.id.name',
        required: true,
        list: false,
        altersDynamicFields: true,
      },
    ],
    outputFields: [
      { key: 'name', label: 'Table Name', type: 'string' },
      { key: 'id', label: 'Table ID', type: 'string' },
    ],
    canPaginate: true,
  },
  key: 'get_all_tables',
  noun: 'Table',
  display: {
    label: 'Get All Tables',
    description: 'This gets all tables in a document.',
    hidden: true,
  },
};
