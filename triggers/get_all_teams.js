const {getApiOptions} = require('./util');

const perform = async (z, bundle) => {
  const options = getApiOptions(bundle, `api/orgs?merged=1`, {
    method: 'GET',
    params: {},
  });

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return results;
  });
};

module.exports = {
  operation: {
    perform: perform,
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
