const perform = async (z, bundle) => {
  const response = await z.request({
    url: '/api/orgs/current/workspaces',
    method: 'GET',
    params: { includeSupport: '' },
  });
  const workspaces = response.data;
  return workspaces.flatMap((ws) =>
    ws.docs.map((doc) => ({
      ...doc,
      name: doc.name + (ws.name !== 'Home' ? ` (${ws.name})` : ''),
    }))
  );
};

module.exports = {
  operation: {
    perform,
    inputFields: [
      {
        key: 'team',
        type: 'string',
        label: 'Team',
        dynamic: 'get_all_teams.domain',
        required: true,
        list: false,
        altersDynamicFields: true,
      },
    ],
    outputFields: [
      { key: 'name', label: 'Document Name', type: 'string' },
      { key: 'id', label: 'Document ID', type: 'string' },
    ],
    canPaginate: true,
  },
  key: 'get_all_documents',
  noun: 'Document',
  display: {
    label: 'Get All Documents',
    description: 'Get all documents for this user',
    hidden: true,
  },
};
