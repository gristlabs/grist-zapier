const {getApiOptions} = require('../triggers/util');

const perform = async (z, bundle) => {
  const vals = { ...bundle.inputData };
  delete vals.document;
  delete vals.team;
  delete vals.table;
  delete vals.record;
  delete vals.column;
  for (const k of Object.keys(vals)) {
    vals[k] = [vals[k]];
  }
  vals.id = [parseInt(bundle.inputData.record, 10)];
  const options = getApiOptions(bundle, `api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/data`, {
    method: 'PATCH',
    params: {},
    body: vals,
  });

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return { id: vals.id };
  });
};

const inputFields = async (z, bundle) => {
  // Configure a request to an endpoint of your api that
  // returns custom field meta data for the authenticated
  // user.  Don't forget to congigure authentication!

  const options = getApiOptions(bundle, `api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/data`, {
    method: 'GET',
    params: {},
  });

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    // modify your api response to return an array of Field objects
    // see https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#fieldschema
    // for schema definition.

    const keys = Object.keys(results);
    return keys
      .filter((key) => key !== 'id' && key !== 'manualSort')
      .map((key) => ({
        key: key,
        label: key,
      }));
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
        key: 'record',
        label: 'Record',
        type: 'string',
        dynamic: 'new_record.id.id',
        search: 'find_record.id',
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      inputFields,
    ],
    sample: { id: 16 },
    outputFields: [{ key: 'id', label: 'ID', type: 'number' }],
  },
  key: 'update_record',
  noun: 'Record',
  display: {
    label: 'Update Record',
    description: 'Update an existing Record in a Grist table',
    hidden: false,
  },
};
