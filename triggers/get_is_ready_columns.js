const {getApiOptions} = require('./util');

const perform = async (z, bundle) => {
  const options = getApiOptions(bundle, `api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/columns`, {
    method: 'GET',
  });

  return z.request(options).then((response) => {
    response.throwForStatus();
    return response.json.columns
      .filter((col) => ['Any', 'Bool'].includes(col.fields.type))
      .map((col) => ({ id: col.id, name: col.fields.label }));
  });
};

module.exports = {
  operation: {
    perform: perform,
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
