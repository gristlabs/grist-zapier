const perform = async (z, bundle) => {
  const response = await z.request({
    url: '/api/orgs',
    method: 'GET',
    params: { merged: 1 },
  });
  return response.data;
};

module.exports = {
  operation: {
    perform,
    outputFields: [
      { key: 'domain', label: 'Team Key', type: 'string' },
      { key: 'name', label: 'Team Name', type: 'string' },
    ],
    canPaginate: true,
  },
  key: 'get_all_teams',
  noun: 'Team',
  display: {
    label: 'Get All Teams',
    description: 'Get all teams for this user',
    hidden: true,
  },
};
