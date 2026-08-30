const { test } = require('./auth-common');

const SCOPE = 'doc:read doc:write doc:webhooks user.profile:read offline_access';

// Each integration built from this flavor is bound to one Grist server, so a
// misconfigured one should fail loudly rather than talk to the wrong server.
const host = () => {
  if (!process.env.GRIST_HOST) {
    throw new Error('GRIST_HOST env var must be set to the Grist server this integration is bound to');
  }
  return process.env.GRIST_HOST;
};

const tokenRequest = async (z, grant) => {
  const response = await z.request({
    method: 'POST',
    url: `https://${host()}/oidc/token`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      ...grant,
    },
  });
  return response.data;
};

const authorizeUrl = (z, bundle) => {
  // Zapier appends the standard OAuth params (client_id, scope, state,
  // redirect_uri, response_type) to whatever this returns. We supply only the
  // endpoint and the PKCE challenge, which it exposes via bundle.inputData.
  const url = new URL(`https://${host()}/oidc/auth`);
  if (bundle.inputData.code_challenge) {
    url.searchParams.set('code_challenge', bundle.inputData.code_challenge);
    url.searchParams.set('code_challenge_method', bundle.inputData.code_challenge_method || 'S256');
  }
  return url.toString();
};

const getAccessToken = async (z, bundle) => {
  const data = await tokenRequest(z, {
    grant_type: 'authorization_code',
    code: bundle.inputData.code,
    redirect_uri: bundle.inputData.redirect_uri,
    code_verifier: bundle.inputData.code_verifier,
  });
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    // buildUrl reads the host from authData.
    hostname: host(),
  };
};

const refreshAccessToken = async (z, bundle) => {
  const data = await tokenRequest(z, {
    grant_type: 'refresh_token',
    refresh_token: bundle.authData.refresh_token,
  });
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token || bundle.authData.refresh_token,
    expires_in: data.expires_in,
  };
};

module.exports = {
  type: 'oauth2',
  test,
  oauth2Config: {
    authorizeUrl,
    getAccessToken,
    refreshAccessToken,
    autoRefresh: true,
    enablePkce: true,
    scope: SCOPE,
  },
  // Interpolated from the `test` response. No app name: Zapier adds its own,
  // and no host, since every connection here reaches the bound server.
  connectionLabel: '{{name}} - {{email}}',
};
