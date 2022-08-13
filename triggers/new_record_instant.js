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
        eventTypes: ['add'],
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
          'A toggle (boolean) column which is `True` when the record is *ready*. The trigger will only be activated when that record *becomes ready*. For example, if you only want to activate a trigger when both `Name` and `Email` are not empty, your readiness column can have the following formula:\n\n    bool($Name and $Email)\n\nThen filling in just one of these columns will create the record in Grist but the trigger will only activate once both are filled in.\n\nFurther changes to the record will not activate the trigger as long as it remains ready. If the readiness column becomes False, then True again, the trigger will be activated again as if the record is newly created.\n\nIf a new record should always activate the trigger immediately, leave this field blank.',
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
  key: 'new_record_instant',
  noun: 'Record',
  display: {
    label: 'New Record (Instant)',
    description: 'Triggers when a new Record is created',
    hidden: false,
    important: true,
  },
};
