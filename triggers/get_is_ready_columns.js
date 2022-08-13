const perform = async (z, bundle) => {
  const options = {
    url: `https://${bundle.inputData.team}.getgrist.com/api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/columns`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.api_key}`,
    },
  };

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
  },
  key: 'get_is_ready_columns',
  noun: 'Column',
  display: {
    label: 'Get Readiness Columns',
    description:
      'Get all columns which can contain true/false to indicate if a record is ready for a trigger',
    hidden: true,
    important: false,
  },
};
