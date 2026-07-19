const perform = async (z, bundle) => {
  const response = await z.request({
    url: `/api/docs/${bundle.inputData.document}/tables`,
    method: 'GET',
  });
  return response.data.tables.map((t) => ({ id: t.id, name: t.id }));
};

module.exports = {
  operation: {
    perform,
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
