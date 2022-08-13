const perform = async (z, bundle) => {
  const vals = { ...bundle.inputData };
  delete vals.document;
  delete vals.team;
  delete vals.table;
  delete vals.column;
  delete vals.value;
  for (const k of Object.keys(vals)) {
    vals[k] = [vals[k]];
  }
  const options = {
    url: `https://${bundle.inputData.team}.getgrist.com/api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/data`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + bundle.authData.api_key,
    },
    params: {},
    body: vals,
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return { id: results[0] };
  });
};

const getInputFields = async (z, bundle) => {
  // Configure a request to an endpoint of your api that
  // returns custom field meta data for the authenticated
  // user.  Don't forget to congigure authentication!

  const options = {
    url: `https://${bundle.inputData.team}.getgrist.com/api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/data`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.api_key}`,
    },
    params: {},
  };

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
      getInputFields,
    ],
    sample: { id: 16 },
    outputFields: [{ key: 'id', label: 'Row ID', type: 'number' }],
  },
  key: 'create_record',
  noun: 'Record',
  display: {
    label: 'Create Record',
    description: 'Creates a new Record in a Table',
    hidden: false,
    important: true,
  },
};
