const perform = async (z, bundle) => {
  return [...bundle.cleanedRequest];
};

const performList = async (z, bundle) => {
  const options = {
    url: `https://${bundle.inputData.team}.getgrist.com/api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/records`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.api_key}`,
    },
    params: {
      sort: '-id',
      limit: 10,
    },
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    return response.json.records.map(({ id, fields }) =>
      Object.assign({ id }, fields)
    );
  });
};

const performSubscribe = async (z, bundle) => {
  return z
    .request({
      url: `https://${bundle.inputData.team}.getgrist.com/api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/_subscribe`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${bundle.authData.api_key}`,
      },
      body: {
        url: bundle.targetUrl,
        eventTypes: ['add', 'update'],
        isReadyColumn: bundle.inputData.is_ready_column || undefined,
      },
    })
    .then((response) => {
      response.throwForStatus();
      return response.json;
    });
};

const performUnsubscribe = async (z, bundle) => {
  return z
    .request({
      url: `https://${bundle.inputData.team}.getgrist.com/api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/_unsubscribe`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${bundle.authData.api_key}`,
      },
      body: bundle.subscribeData,
    })
    .then((response) => {
      response.throwForStatus();
      return response.json;
    });
};

module.exports = {
  operation: {
    perform: perform,
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
        key: 'is_ready_column',
        type: 'string',
        label: 'Readiness column',
        dynamic: 'get_is_ready_columns.id.name',
        helpText:
          'A toggle (boolean) column which is `True` when the record is *ready*. When a record is created or updated, the trigger will be activated if and only if the record is ready. For example, if you only want to activate a trigger when both `Name` and `Email` are not empty, your readiness column can have the following formula:\n\n    bool($Name and $Email)\n\nIf any change to a record should always activate the trigger, leave this field blank.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    type: 'hook',
    performSubscribe: performSubscribe,
    performUnsubscribe: performUnsubscribe,
    performList: performList,
    sample: { id: 53759 },
    outputFields: [{ key: 'id', label: 'Row ID', type: 'integer' }],
  },
  key: 'updated_record_instant',
  noun: 'Record',
  display: {
    label: 'New or Updated Record (Instant)',
    description: 'Triggers when a Record is updated, or a new Record is added.',
    hidden: false,
    important: true,
  },
};
