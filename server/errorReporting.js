import * as Sentry from '@sentry/node';

const REQUEST_KEYS = ['data', 'cookies', 'env', 'headers', 'query_string'];

export const dataCollection = {
  userInfo: false,
  cookies: false,
  httpHeaders: false,
  httpBodies: [],
  urlQueryParams: false,
  graphQL: { document: false, variables: false },
  genAI: { inputs: false, outputs: false },
  databaseQueryData: false,
  queues: false,
  stackFrameVariables: false,
  frameContextLines: 0,
};

const ROUND_PATH = /\/rounds\/[^/]+/;

function scrubPath(value) {
  return value.replace(/[?#].*$/, '').replace(ROUND_PATH, '/rounds/:id');
}

export function scrubEvent(event) {
  const copy = { ...event };
  delete copy.user;
  delete copy.breadcrumbs;
  delete copy.server_name;
  delete copy.contexts;
  delete copy.tags;
  delete copy.extra;
  if (copy.transaction) copy.transaction = scrubPath(copy.transaction);
  if (copy.request) {
    const request = { ...copy.request };
    for (const key of REQUEST_KEYS) delete request[key];
    if (request.url) request.url = scrubPath(request.url);
    copy.request = request;
  }
  if (copy.exception?.values) {
    copy.exception = {
      ...copy.exception,
      values: copy.exception.values.map((exception) => ({
        ...exception,
        stacktrace: exception.stacktrace && {
          ...exception.stacktrace,
          frames: exception.stacktrace.frames?.map(({ vars: _vars, ...frame }) => frame),
        },
      })),
    };
  }
  return copy;
}

export function initErrorReporting(env, sink = Sentry, extraOptions = {}) {
  const dsn = env.SENTRY_DSN?.trim();
  if (!dsn) return false;
  sink.init({ dsn, dataCollection, maxBreadcrumbs: 0, beforeSend: scrubEvent, ...extraOptions });
  return true;
}
