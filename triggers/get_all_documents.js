const perform = async (z, bundle) => {
  const options = {
    url: `https://${bundle.inputData.team}.getgrist.com/api/orgs/current/workspaces`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.api_key}`,
    },
    params: {
      includeSupport: '',
    },
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    const flat = [].concat.apply(
      [],
      results.map((r) =>
        r.docs.map((d) => ({
          ...d,
          name: d.name + (r.name !== 'Home' ? ` (${r.name})` : ''),
        }))
      )
    );
    return flat;
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
        dynamic: 'get_all_teams.domain',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    outputFields: [
      { key: 'name', label: 'Document Name', type: 'string' },
      { key: 'id', label: 'Document ID', type: 'string' },
    ],
  },
  key: 'get_all_documents',
  noun: 'Document',
  display: {
    label: 'Get All Documents',
    description: 'Get all documents for this user',
    hidden: true,
    important: false,
  },
};
