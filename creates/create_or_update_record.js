const { colName, isWritable, fetchColumns } = require('../lib/columns');

const perform = async (z, bundle) => {
  const { inputData } = bundle;

  const record = { require: {}, fields: {} };
  for (const inputKey of Object.keys(inputData)) {
    for (const recordKey of Object.keys(record)) {
      const prefix = recordKey + '.';
      if (inputKey.startsWith(prefix)) {
        const colId = inputKey.substr(prefix.length);
        let value = inputData[inputKey];
        if (colId === 'id') {
          value = Number(value);
        }
        record[recordKey][colId] = value;
      }
    }
  }

  const { document, table } = inputData;
  await z.request({
    url: `/api/docs/${document}/tables/${table}/records`,
    method: 'PUT',
    body: { records: [record] },
  });
  return { status: 'ok' };
};

const inputFields = async (z, bundle) => {
  const { matchFields } = bundle.inputData;
  const columns = await fetchColumns(z, bundle);
  const nameById = new Map(columns.map((c) => [c.id, colName(c)]));
  return [
    ...matchFields.map((colId) => ({
      key: 'require.' + colId,
      label: `Find records (or create if not found) where ${nameById.get(colId) ?? colId} is`,
    })),
    ...columns
      .filter(isWritable)
      .map((col) => ({
        key: 'fields.' + col.id,
        label: `Set ${colName(col)} to`,
      })),
  ];
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
        key: 'matchFields',
        label: 'Destination fields to match on',
        type: 'string',
        helpText:
          'Select at least one field in the **destination table** to use for finding the record to update.',
        dynamic: 'get_all_columns.id.name',
        required: true,
        list: true,
        altersDynamicFields: true,
      },
      inputFields,
    ],
    outputFields: [{ key: 'success' }],
    sample: { success: 'ok' },
  },
  key: 'create_or_update_record',
  noun: 'Record',
  display: {
    label: 'Create or Update Record',
    description:
      'Creates a new record in a table, or updates an existing matching record.',
    hidden: false,
  },
};
