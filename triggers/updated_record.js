const perform = async (z, bundle) => {
  const dateCol = bundle.inputData.date;
  const response = await z.request({
    url: `/api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/records`,
    method: 'GET',
    params: { sort: dateCol ? '-' + dateCol : '-id', limit: 100 },
  });
  return response.data.records.map(({ id, fields }) => {
    const rec = { id, ...fields };
    if (dateCol) {
      rec.originalId = id;
      rec.id = `${id}-${fields[dateCol]}`;
    }
    return rec;
  });
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
      {
        key: 'date',
        type: 'string',
        label: 'Date',
        helpText: 'Column containing date when record was last updated.',
        dynamic: 'get_all_columns.id.name',
        required: false,
        list: false,
        altersDynamicFields: true,
      },
    ],
    sample: { id: 53759 },
    outputFields: [{ key: 'id', label: 'Row ID', type: 'integer' }],
  },
  key: 'updated_record',
  noun: 'Record',
  display: {
    label: 'New or Updated Record',
    description: 'Triggers when a record is created or updated.',
    hidden: false,
  },
};
