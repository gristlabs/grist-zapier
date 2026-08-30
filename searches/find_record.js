const { flattenRecords } = require('../lib/records');

const perform = async (z, bundle) => {
  const response = await z.request({
    url: `/api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/records`,
    method: 'GET',
    params: {
      sort: '-id',
      limit: 100,
      filter: JSON.stringify({
        [bundle.inputData.column]: [bundle.inputData.value],
      }),
    },
  });
  return flattenRecords(response.data.records);
};

module.exports = {
  operation: {
    perform,
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
        altersDynamicFields: true,
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
    description: 'Finds a record in a table.',
    hidden: false,
  },
};
