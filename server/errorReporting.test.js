import * as Sentry from '@sentry/node';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { dataCollection, initErrorReporting, scrubEvent } from './errorReporting.js';

const DSN = 'https://publickey@sentry.example/4';

describe('scrubEvent', () => {
  const event = {
    event_id: '0123456789abcdef0123456789abcdef',
    message: 'plain',
    user: { id: '7', ip_address: '198.51.100.7' },
    breadcrumbs: [{ message: 'fetch' }],
    request: {
      url: 'http://mathema.example/api/scores?name=abc#frag',
      method: 'POST',
      data: { name: 'abc' },
      cookies: { sid: '1' },
      headers: { authorization: 'Bearer abc' },
      env: { REMOTE_ADDR: '198.51.100.7' },
      query_string: 'name=abc',
    },
    exception: {
      values: [{ type: 'Error', value: 'boom', stacktrace: { frames: [{ function: 'f', lineno: 3, vars: { secret: 'x' } }] } }],
    },
  };

  it('removes user, breadcrumbs, request data and frame variables', () => {
    const out = scrubEvent(event);
    expect(out.user).toBeUndefined();
    expect(out.breadcrumbs).toBeUndefined();
    expect(out.request).toEqual({ url: 'http://mathema.example/api/scores', method: 'POST' });
    expect(out.exception.values[0].stacktrace.frames).toEqual([{ function: 'f', lineno: 3 }]);
    expect(out.event_id).toBe(event.event_id);
  });

  it('does not mutate its input', () => {
    const before = structuredClone(event);
    scrubEvent(event);
    expect(event).toEqual(before);
  });

  it('handles a bare event', () => {
    expect(scrubEvent({ message: 'plain' })).toEqual({ message: 'plain' });
  });
});

describe('initErrorReporting', () => {
  it('does nothing without a DSN', () => {
    const sink = { init: vi.fn() };
    expect(initErrorReporting({}, sink)).toBe(false);
    expect(initErrorReporting({ SENTRY_DSN: '  ' }, sink)).toBe(false);
    expect(sink.init).not.toHaveBeenCalled();
  });

  it('passes every data collection switch off', () => {
    const sink = { init: vi.fn() };
    expect(initErrorReporting({ SENTRY_DSN: ` ${DSN} ` }, sink)).toBe(true);
    const options = sink.init.mock.calls[0][0];
    expect(options.dsn).toBe(DSN);
    expect(options.dataCollection).toEqual(dataCollection);
    expect(options.dataCollection.stackFrameVariables).toBe(false);
    expect(options.dataCollection.userInfo).toBe(false);
    expect(options).not.toHaveProperty('sendDefaultPii');
    expect(options).not.toHaveProperty('includeLocalVariables');
    expect(options.beforeSend).toBe(scrubEvent);
  });
});

describe('real SDK', () => {
  afterEach(async () => {
    await Sentry.close(100);
  });

  it('sends an event without local variables, request data or user data', async () => {
    const envelopes = [];
    const transport = () => ({
      send: (envelope) => {
        envelopes.push(envelope);
        return Promise.resolve({});
      },
      flush: () => Promise.resolve(true),
    });
    expect(initErrorReporting({ SENTRY_DSN: DSN }, Sentry, { transport })).toBe(true);
    try {
      const localSecret = ['local', 'secret', 'value', '98765'].join('-');
      throw new Error('failed ' + localSecret.length);
    } catch (error) {
      Sentry.getCurrentScope().setUser({ id: '7', email: 'person@example.com' });
      Sentry.getCurrentScope().setSDKProcessingMetadata({
        normalizedRequest: { url: 'http://mathema.example/x?name=abc', headers: { cookie: 'sid=1' }, data: 'name=abc' },
      });
      Sentry.captureException(error);
    }
    await Sentry.flush(1000);
    expect(envelopes.filter((envelope) => envelope[1].some(([item]) => item.type === 'event'))).toHaveLength(1);
    const dumped = JSON.stringify(envelopes);
    expect(dumped).toContain('failed');
    expect(dumped).not.toContain('local-secret-value-98765');
    expect(dumped).not.toContain('"vars"');
    expect(dumped).not.toContain('"pre_context"');
    expect(dumped).not.toContain('"context_line"');
    expect(dumped).not.toContain('"user"');
    expect(dumped).not.toContain('person@example.com');
    expect(dumped).not.toContain('"breadcrumbs"');
    expect(dumped).not.toContain('sid=1');
    expect(dumped).not.toContain('name=abc');
  });
});
