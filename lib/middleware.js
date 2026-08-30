const HOSTNAME_RE = /^[a-z0-9-.]+(:\d+)?$/;
const HOSTNAME_ERROR =
  'Hostname can only contain lowercase letters, numbers, dashes, dots, and an optional port.';

// Grist API calls are written as relative URLs; the OAuth handshake (/oidc/*)
// is the only absolute one. It must not carry a bearer — Grist rejects
// /oidc/token for using two client-auth mechanisms at once. Hence the order in
// index.js: addBearerAuth runs while the URL still tells the two apart, and
// buildUrl expands it afterwards.
const isRelative = (url) => !/^https?:\/\//.test(url);

function addBearerAuth(request, z, bundle) {
  const token = bundle.authData?.access_token || bundle.authData?.api_key;
  if (isRelative(request.url) && token) {
    request.headers.Authorization = `Bearer ${token}`;
    request.headers.Accept = request.headers.Accept || 'application/json';
  }
  return request;
}

function buildUrl(request, z, bundle) {
  if (!isRelative(request.url)) {
    return request;
  }
  const hostname = bundle.authData?.hostname;
  if (!hostname || !HOSTNAME_RE.test(hostname)) {
    throw new z.errors.Error(HOSTNAME_ERROR, 'InvalidData', 400);
  }
  // protocol is set only by tests, to reach a local Grist over http.
  const protocol = bundle.authData.protocol || 'https';
  const team = bundle.inputData?.team;
  request.url = `${protocol}://${hostname}${team ? `/o/${team}` : ''}${request.url}`;
  return request;
}

module.exports = { addBearerAuth, buildUrl };
