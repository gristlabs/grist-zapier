# Changelog

## 2.0.0

The repo now powers two Zapier integrations:

- **Grist** — OAuth2 + PKCE (new). Recommended.
- **Grist (API key)** — API-key auth (existing behavior). For instances
  without OAuth Apps.

Selected at push time via `GRIST_ZAPIER_AUTH=oauth|apikey`. See
[`README.md`](README.md).

### Breaking

- Minimum Node.js version is now 22.
- Existing Zaps continue to work on the published 1.x integration.

### Other notable changes

- All Grist API calls now use the modern `/records`, `/columns`,
  `/tables`, and `/webhooks` endpoints; deprecated `/data`,
  `/_subscribe`, and `/_unsubscribe` are gone.
- 401 responses trigger automatic token refresh via Zapier.
- Connection label keeps the name and email it already showed;
  API-key connections also show the Grist server they point at.
- Column dropdowns now show `Label ($colId)` when label and colId
  differ.
- `update_record` returns `{id: number}` instead of `{id: [number]}`.
- Empty values mapped to record fields are now written to Grist (clearing
  the target cell) instead of being dropped, per [Zapier's
  recommendation](https://docs.zapier.com/integrations/build-cli/empty-values-in-input-data)
  to disable `cleanInputData`.

### Operator note

Self-hosted instances using instant triggers need `zapier.com` in
their `ALLOWED_WEBHOOK_DOMAINS` (comma-separated).
