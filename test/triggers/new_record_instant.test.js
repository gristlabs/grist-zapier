const { App, appTester, authData, target, listWebhooks } = require('../helpers');

const op = App.triggers['new_record_instant'].operation;

describe('triggers.new_record_instant', () => {
  it('perform passes through cleanedRequest', async () => {
    const bundle = { authData, inputData: target, cleanedRequest: [{ id: 5 }] };
    const results = await appTester(op.perform, bundle);
    expect(results).toEqual([{ id: 5 }]);
  });

  it('subscribe registers a webhook; unsubscribe removes it', async () => {
    const url = `https://example.com/zapier-test-${Date.now()}`;
    const sub = await appTester(op.performSubscribe, { authData, inputData: target, targetUrl: url });
    expect(sub.webhookId).toEqual(expect.any(String));

    const after = await listWebhooks();
    expect(after).toContainEqual(expect.objectContaining({ id: sub.webhookId }));

    await appTester(op.performUnsubscribe, { authData, inputData: target, subscribeData: sub });

    const final = await listWebhooks();
    expect(final.find((w) => w.id === sub.webhookId)).toBeUndefined();
  });

  it('performList returns recent records', async () => {
    const results = await appTester(op.performList, { authData, inputData: target });
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('Email');
  });
});
