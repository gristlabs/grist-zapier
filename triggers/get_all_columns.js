const { colName, isHiddenColumn, fetchColumns } = require('../lib/columns');

const perform = async (z, bundle) => {
  const columns = await fetchColumns(z, bundle);
  return columns
    .filter((col) => !isHiddenColumn(col))
    .map((col) => ({ id: col.id, name: colName(col) }));
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
        required: false,
        list: false,
        altersDynamicFields: true,
      },
      {
        key: 'table',
        type: 'string',
        label: 'Table',
        dynamic: 'get_all_tables.id.name',
        required: false,
        list: false,
        altersDynamicFields: true,
      },
    ],
    outputFields: [
      { key: 'id', label: 'ID', type: 'string' },
      { key: 'name', label: 'Name', type: 'string' },
    ],
    canPaginate: true,
  },
  key: 'get_all_columns',
  noun: 'Column',
  display: {
    label: 'Get All Columns',
    description: 'Get all Columns in a Table',
    hidden: true,
  },
};
