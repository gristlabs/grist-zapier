const { flattenRecords } = require('./records');

// The two instant triggers differ only in which Grist events they listen for.
// Toggling a Zap on or off creates or removes the Grist webhook.
const hookOperation = (eventTypes) => ({
  perform: async (z, bundle) => [...bundle.cleanedRequest],

  performSubscribe: async (z, bundle) => {
    const response = await z.request({
      url: `/api/docs/${bundle.inputData.document}/webhooks`,
      method: 'POST',
      body: {
        webhooks: [{
          fields: {
            url: bundle.targetUrl,
            eventTypes,
            tableId: bundle.inputData.table,
            isReadyColumn: bundle.inputData.is_ready_column || undefined,
          },
        }],
      },
    });
    return { webhookId: response.data.webhooks[0].id };
  },

  performUnsubscribe: async (z, bundle) => {
    const response = await z.request({
      url: `/api/docs/${bundle.inputData.document}/webhooks/${bundle.subscribeData.webhookId}`,
      method: 'DELETE',
    });
    return response.data;
  },

  performList: async (z, bundle) => {
    const response = await z.request({
      url: `/api/docs/${bundle.inputData.document}/tables/${bundle.inputData.table}/records`,
      method: 'GET',
      params: { sort: '-id', limit: 10 },
    });
    return flattenRecords(response.data.records);
  },
});

module.exports = { hookOperation };
