const { addBearerAuth, buildUrl } = require('../lib/middleware');

// buildUrl reports a bad hostname through z.errors.Error.
const z = { errors: { Error: class extends Error {} } };

describe('middleware.buildUrl', () => {
  const build = (url, authData, inputData = {}) => buildUrl({ url }, z, { authData, inputData }).url;

  it('prefixes host, no team', () => {
    expect(build('/api/profile/user', { hostname: 'api.getgrist.com' }))
      .toBe('https://api.getgrist.com/api/profile/user');
  });

  it('inserts /o/{team} when team is present', () => {
    expect(build('/api/docs/abc/tables', { hostname: 'api.getgrist.com' }, { team: 'acme' }))
      .toBe('https://api.getgrist.com/o/acme/api/docs/abc/tables');
  });

  it('honors override protocol from authData (test mode)', () => {
    expect(build('/api/profile/user', { hostname: 'localhost:8080', protocol: 'http' }))
      .toBe('http://localhost:8080/api/profile/user');
  });

  it('leaves an absolute url alone', () => {
    expect(build('https://api.getgrist.com/oidc/token', { hostname: 'api.getgrist.com' }))
      .toBe('https://api.getgrist.com/oidc/token');
  });

  it.each([
    ['localhost:8080'],
    ['my-grist.example.com'],
    ['192.168.1.1:8484'],
  ])('accepts hostname %s', (hostname) => {
    expect(build('/api/profile/user', { hostname })).toContain(hostname);
  });

  it.each([
    ['bad host;rm -rf /'],
    ['https://api.getgrist.com'],
    [''],
    [undefined],
  ])('rejects hostname %s', (hostname) => {
    expect(() => build('/api/profile/user', { hostname })).toThrow(z.errors.Error);
  });
});

describe('middleware.addBearerAuth', () => {
  const auth = (url, authData) => addBearerAuth({ url, headers: {} }, z, { authData }).headers;

  it('adds Authorization from access_token', () => {
    expect(auth('/api/profile/user', { access_token: 'grist_at_abc' }).Authorization)
      .toBe('Bearer grist_at_abc');
  });

  it('uses api_key for the API-key flavor', () => {
    expect(auth('/api/profile/user', { api_key: 'legacy_key' }).Authorization)
      .toBe('Bearer legacy_key');
  });

  it('does nothing when no credential', () => {
    expect(auth('/api/profile/user', {}).Authorization).toBeUndefined();
  });

  // Grist rejects /oidc/token if it carries a bearer as well as client
  // credentials. Only the OAuth handshake uses absolute URLs.
  it('never attaches a bearer to an absolute url', () => {
    expect(auth('https://api.getgrist.com/oidc/token', { access_token: 'grist_at_abc' }).Authorization)
      .toBeUndefined();
  });
});
