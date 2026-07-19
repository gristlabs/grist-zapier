const { columnInputFields } = require('../lib/columns');
const { pickFields } = require('../lib/records');

const perform = async (z, bundle) => {
  const id = parseInt(bundle.inputData.record, 10);
  await z.request({
    url: `/api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/records`,
    method: 'PATCH',
    body: { records: [{ id, fields: pickFields(bundle.inputData) }] },
  });
  return { id };
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
        key: 'record',
        label: 'Record',
        type: 'string',
        dynamic: 'new_record.id.id',
        search: 'find_record.id',
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      columnInputFields,
    ],
    sample: { id: 16 },
    outputFields: [{ key: 'id', label: 'ID', type: 'number' }],
  },
  key: 'update_record',
  noun: 'Record',
  display: {
    label: 'Update Record',
    description: 'Updates an existing record.',
    hidden: false,
  },
};
