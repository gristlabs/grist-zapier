const { columnInputFields } = require('../lib/columns');
const { pickFields } = require('../lib/records');

const perform = async (z, bundle) => {
  const response = await z.request({
    url: `/api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/records`,
    method: 'POST',
    body: { records: [{ fields: pickFields(bundle.inputData) }] },
  });
  return { id: response.data.records[0].id };
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
      columnInputFields,
    ],
    sample: { id: 16 },
    outputFields: [{ key: 'id', label: 'Row ID', type: 'number' }],
  },
  key: 'create_record',
  noun: 'Record',
  display: {
    label: 'Create Record',
    description: 'Creates a new record in a table.',
    hidden: false,
  },
};
