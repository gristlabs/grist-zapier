const testAuth = async (z, bundle) => {
  const options = {
    url: 'https://docs.getgrist.com/api/profile/user',
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + bundle.authData.api_key,
    },
    params: {},
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return results;
  });
};

module.exports = {
  type: 'custom',
  test: testAuth,
  fields: [
    {
      computed: false,
      key: 'api_key',
      required: true,
      label: 'API Key',
      type: 'string',
      helpText:
        'Go to your [Personal Grist Site](https://docs.getgrist.com/), click on the account menu on the top right, then click on "Profile Settings" to create or access your API Key.',
    },
  ],
  customConfig: {},
  connectionLabel: '{{name}} - {{email}}',
};
