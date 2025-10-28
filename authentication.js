const {getApiOptions} = require('./triggers/util');

const test = async (z, bundle) => {
  const options = getApiOptions(bundle, `api/profile/user`, {
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
  type: 'custom',
  test: test,
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
    {
      computed: false,
      key: 'hostname',
      required: false,
      label: 'Custom Hostname',
      type: 'string',
      helpText:
      'If connecting to a non-standard or [self-managed Grist instance](https://support.getgrist.com/self-managed/#how-do-i-run-grist-on-a-server), enter its hostname here. For personal and team accounts on the standard SaaS service, there is no need to change the default.',
      default: 'api.getgrist.com',
    },
  ],
  customConfig: {},
  connectionLabel: '{{name}} - {{email}}',
};
