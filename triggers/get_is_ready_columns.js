const { colName, fetchColumns } = require('../lib/columns');

const perform = async (z, bundle) => {
  const columns = await fetchColumns(z, bundle);
  return columns
    .filter((col) => ['Any', 'Bool'].includes(col.fields.type))
    .map((col) => ({ id: col.id, name: colName(col) }));
};

module.exports = {
  operation: {
    perform,
    outputFields: [
      { key: 'id', label: 'ID', type: 'string' },
      { key: 'name', label: 'Name', type: 'string' },
    ],
    canPaginate: true,
  },
  key: 'get_is_ready_columns',
  noun: 'Column',
  display: {
    label: 'Get Readiness Columns',
    description:
      'Get all columns which can contain true/false to indicate if a record is ready for a trigger',
    hidden: true,
  },
};
