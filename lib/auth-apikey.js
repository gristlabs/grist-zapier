const { DEFAULT_HOST, test } = require('./auth-common');

module.exports = {
  type: 'custom',
  test,
  fields: [
    {
      computed: false,
      key: 'hostname',
      required: true,
      label: 'Grist server',
      type: 'string',
      placeholder: 'grist.example.com',
      default: DEFAULT_HOST,
      helpText:
        "Your Grist server's hostname, e.g. `grist.example.com` for a [self-managed Grist](https://support.getgrist.com/self-managed/). Leave the default for Grist's hosted service.",
    },
    {
      computed: false,
      key: 'api_key',
      required: true,
      label: 'API Key',
      type: 'string',
      helpText:
        'In Grist, open the account menu → Account settings → [Developer](https://support.getgrist.com/rest-api/#api-keys) to create or copy your API key.',
    },
  ],
  // Name and email from the `test` response, plus the server: Zapier
  // recommends the domain for apps that can be self-hosted.
  connectionLabel: '{{name}} - {{email}} ({{bundle.authData.hostname}})',
};
