# grist-zapier

This is the Zapier-side code for the Grist/Zapier integration,
exported as a reference using the [Zapier cli](https://platform.zapier.com/docs/export).

Links to some support articles related to this integration:

  * [Storing form submissions](https://support.getgrist.com/integrators/#example-storing-form-submissions)
  * [Sending email alerts](https://support.getgrist.com/integrators/#example-sending-email-alerts)

## Development

Install dependencies first:

```
npm install
```

To run tests, first run a test instance of Grist locally on port 8080 (requires docker):
```
npm start:grist
```
This instance serves the data in the `fixtures` directory, and has a test user.

Now you can run the tests:
```
npm test
```

You can get extra analysis using the [Zapier cli tool](https://developer.zapier.com/cli-guide/install-the-zapier-cli).

```
zapier test
```
