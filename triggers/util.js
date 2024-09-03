
function getApiOptions(bundle, relativeUrl, options) {
  // Manual validation step to ensure the hostname is reasonable.
  if (!/^[a-z0-9-.]+(:\d+)?$/.test(bundle.authData.hostname)) {
    throw new Error("Hostname parts can only contain letters, numbers and dashes");
  }

  const protocol = bundle.authData.protocol || 'https';   // Only defined in tests.
  const hostUrl = `${protocol}://${bundle.authData.hostname}`;
  const baseUrl = bundle.inputData.team ? `${hostUrl}/o/${bundle.inputData.team}` : hostUrl;

  return {
    url: `${baseUrl}/${relativeUrl}`,
    headers: {
      Accept: 'application/json',
      ...(bundle.authData.api_key ? {Authorization: `Bearer ${bundle.authData.api_key}`} : {}),
      ...options.headers,
    },
    ...options
  }
}

module.exports = {getApiOptions};
