# grist-zapier

Code for the Grist/Zapier integration, built with the
[Zapier Platform CLI](https://platform.zapier.com/docs/cli).

This one repo powers two kinds of Zapier integrations:

- **Grist** — OAuth2 with PKCE, one-click connect, no questions asked.
  Each integration built from this flavor is bound to a single Grist
  server via `GRIST_HOST`: the public "Grist" app to hosted Grist
  (api.getgrist.com), and per-customer builds to that customer's own
  instance.
- **Grist (API key)** — API-key auth, with a hostname field. Works with
  any Grist, notably self-hosted instances without OAuth Apps.

Links to support articles related to this integration:

  * [Storing form submissions](https://support.getgrist.com/integrators/#example-storing-form-submissions)
  * [Sending email alerts](https://support.getgrist.com/integrators/#example-sending-email-alerts)

## The flavor switch

`GRIST_ZAPIER_AUTH` (`oauth` or `apikey`) is the single input that picks a
flavor. It selects the auth config, and — through `scripts/select-app.js`
and the app ids in [`apps.json`](apps.json) — the Zapier app a push
targets, so the code and its destination cannot disagree. It must also
exist as a version env var on Zapier, because the deployed code reads it
at runtime; `npm run push` sets that for you.

Every npm script below sets it. A bare `zapier-platform` command does
not, and acts on whichever app was pushed last.

## Environment variables

See [`.env.example`](.env.example) for the full list. Highlights for the
OAuth flavor:

- `CLIENT_ID` / `CLIENT_SECRET` — the OAuth client this integration
  connects as, registered on the Grist server it is bound to.
- `GRIST_HOST` — the Grist server this integration is bound to:
  api.getgrist.com for the public "Grist" app, a customer's own instance
  for a per-customer integration. Required — the OAuth flavor fails
  loudly without it rather than serving a default.

## Development

```sh
npm install
```

### Run tests

Tests run against a local Grist instance — start one in another terminal:

```sh
npm run start:grist     # docker, port 8080, allows all webhook domains
```

Then:

```sh
npm test                # default (API-key) flavor
```

### Validate

```sh
npm run validate                # both flavors
npm run validate:oauth          # OAuth flavor only
npm run validate:apikey         # API-key flavor only
```

### Push to Zapier

```sh
npm run push:oauth              # "Grist" (OAuth)
npm run push:apikey             # "Grist (API key)"
```

After pushing, these also check the pushed version's env vars: they set
`GRIST_ZAPIER_AUTH`, and for the OAuth flavor fail with instructions
unless `GRIST_HOST`, `CLIENT_ID`, and `CLIENT_SECRET` are present. Those
three have per-app values, so setting them stays a manual one-time step
per new app. Values are copied forward to later versions, and are
guarded once a version is promoted to production.

### Other CLI commands

The flavored wrappers pick an app explicitly, passing everything after
`--` through to the CLI:

```sh
npm run zapier-platform:oauth -- logs --type=http --detailed
npm run zapier-platform:apikey -- env:get 2.0.0
npm run zapier-platform:oauth -- versions
```

This is also how the OAuth binding trio gets set on a version — all
three in one call:

```sh
npm run zapier-platform:oauth -- env:set 2.0.0 \
  GRIST_HOST=api.getgrist.com CLIENT_ID=... CLIENT_SECRET=...
```

### Self-hosted production note

Instant triggers POST webhook URLs to Grist. Grist refuses webhooks to
unlisted domains; self-hosted deployments need to add `zapier.com` to
their `ALLOWED_WEBHOOK_DOMAINS` (the env var is comma-separated):

```sh
ALLOWED_WEBHOOK_DOMAINS=zapier.com,existing.domain.com,...
```
