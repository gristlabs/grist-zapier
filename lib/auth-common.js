const DEFAULT_HOST = 'api.getgrist.com';

// Doubles as the connection test and as the source of the connection label:
// Zapier passes this response to connectionLabel as bundle.inputData.
const test = async (z) => {
  const response = await z.request({
    url: '/api/profile/user',
    method: 'GET',
  });
  return response.data;
};

module.exports = { DEFAULT_HOST, test };
