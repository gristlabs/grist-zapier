const { flattenRecords } = require('../lib/records');

const perform = async (z, bundle) => {
  const response = await z.request({
    url: `/api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/records`,
    method: 'GET',
    params: { sort: '-id', limit: 100 },
  });
  return flattenRecords(response.data.records);
};

module.exports = {
  operation: {
    perform,
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
    description: 'Triggers when a new record is created.',
    hidden: false,
  },
};
