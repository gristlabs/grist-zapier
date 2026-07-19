const oauth = require('../lib/auth-oauth');

function captureRequest() {
  const captured = {};
  const z = {
    request: async (opts) => {
      captured.url = opts.url;
      captured.body = opts.body;
      return { data: { access_token: 'fake', refresh_token: 'fake' } };
    },
  };
  return { z, captured };
}

const ORIGINAL_ENV = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  GRIST_HOST: process.env.GRIST_HOST,
};

beforeEach(() => {
  process.env.CLIENT_ID = 'env-cid';
  process.env.CLIENT_SECRET = 'env-csec';
  process.env.GRIST_HOST = 'api.getgrist.com';
});

afterEach(() => {
  for (const [k, v] of Object.entries(ORIGINAL_ENV)) {
    if (v === undefined) {
      delete process.env[k];
    } else {
      process.env[k] = v;
    }
  }
});

const baseInput = { code: 'c', redirect_uri: 'r', code_verifier: 'v' };

describe('auth-oauth.test', () => {
  it('builds the authorize URL with only the endpoint and PKCE params', () => {
    const url = new URL(oauth.oauth2Config.authorizeUrl(null, {
      inputData: { code_challenge: 'ch' },
    }));
    expect(url.origin).toBe('https://api.getgrist.com');
    expect(url.pathname).toBe('/oidc/auth');
    expect(url.searchParams.get('code_challenge')).toBe('ch');
    expect(url.searchParams.get('code_challenge_method')).toBe('S256');
    // The standard OAuth params are Zapier's to set, not ours.
    expect([...url.searchParams.keys()]).toEqual(['code_challenge', 'code_challenge_method']);
  });

  it('binds to GRIST_HOST for per-customer builds', () => {
    process.env.GRIST_HOST = 'grist.example.com';
    const url = new URL(oauth.oauth2Config.authorizeUrl(null, { inputData: {} }));
    expect(url.origin).toBe('https://grist.example.com');
  });

  it('throws without GRIST_HOST rather than serving a default host', () => {
    delete process.env.GRIST_HOST;
    expect(() => oauth.oauth2Config.authorizeUrl(null, { inputData: {} })).toThrow(/GRIST_HOST/);
  });

  it('exchanges the code with env credentials and stores the bound host', async () => {
    const { z, captured } = captureRequest();
    const result = await oauth.oauth2Config.getAccessToken(z, { inputData: baseInput });
    expect(captured.url).toBe('https://api.getgrist.com/oidc/token');
    expect(captured.body.client_id).toBe('env-cid');
    expect(captured.body.client_secret).toBe('env-csec');
    expect(captured.body.code_verifier).toBe('v');
    expect(result.hostname).toBe('api.getgrist.com');
  });

  it('ignores user-supplied host and credentials entirely', async () => {
    const { z, captured } = captureRequest();
    await oauth.oauth2Config.getAccessToken(z, {
      inputData: { ...baseInput, hostname: 'evil.example.com', client_id: 'x', client_secret: 'y' },
      authData: { hostname: 'evil.example.com' },
    });
    expect(captured.url).toBe('https://api.getgrist.com/oidc/token');
    expect(captured.body.client_id).toBe('env-cid');
    expect(captured.body.client_secret).toBe('env-csec');
  });

  it('refreshes against the bound host with env credentials', async () => {
    const { z, captured } = captureRequest();
    const result = await oauth.oauth2Config.refreshAccessToken(z, {
      authData: { refresh_token: 'rt' },
      inputData: {},
    });
    expect(captured.url).toBe('https://api.getgrist.com/oidc/token');
    expect(captured.body.refresh_token).toBe('rt');
    expect(captured.body.client_secret).toBe('env-csec');
    expect(result.refresh_token).toBe('fake');
  });
});
