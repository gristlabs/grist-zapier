const {getApiOptions} = require('../triggers/util');

const perform = async (z, bundle) => {
  const { inputData, authData } = bundle;

  const record = {
    require: {},
    fields: {},
  };
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
  const options = getApiOptions(bundle, `api/docs/${document}/tables/${table}/records`, {
    method: 'PUT',
    params: {},
    body: { records: [record] },
  });

  return z.request(options).then((response) => {
    response.throwForStatus();
    return { status: 'ok' };
  });
};

const inputFields = async (z, bundle) => {
  const { inputData, authData } = bundle;
  const { document, table, matchFields } = inputData;
  const options = getApiOptions(bundle, `api/docs/${document}/tables/${table}/columns`, {
    method: 'GET',
    params: {},
  });

  return z.request(options).then((response) => {
    response.throwForStatus();
    const colLabels = new Map(
      response.json.columns.map((c) => [c.id, c.fields.label])
    );
    return [
      ...matchFields.map((colId) => ({
        key: 'require.' + colId,
        label:
          'Find records (or create if not found) where ' +
          colLabels.get(colId) +
          ' is',
      })),
      ...response.json.columns
        .filter((col) => !(col.fields.isFormula && col.fields.formula))
        .map((col) => ({
          key: 'fields.' + col.id,
          label: 'Set ' + col.fields.label + ' to',
        })),
    ];
  });
};

module.exports = {
  operation: {
    perform: perform,
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
      'Creates a new Record in a Table, or Updates an existing matching Record',
    hidden: false,
  },
};
