import fetch from 'node-fetch';
import https from 'https';
import Boom from 'boom';
import urlJoin from 'url-join';

const { CBAAS_URL = '', API_KEY, API_SECRET } = process.env;

export default async (path = '', method, headers, body, timeout = 10000) => {
  const mergedHeaders = {
    'Content-Type': 'application/json',
    'x-caf-api-key': API_KEY,
    'x-caf-api-secret': API_SECRET,
    ...headers,
  };

  const agent = new https.Agent({
    secureProtocol: 'TLSv1_2_method',
  });
  const options = {
    method,
    body: JSON.stringify(body),
    headers: mergedHeaders,
    timeout,
  };

  const url = urlJoin(CBAAS_URL, path);

  let fetched;
  try {
    if (url.startsWith('https:'))
      fetched = await fetch(url, {
        ...options,
        agent,
      });
    else {
      fetched = await fetch(url, options);
    }
  } catch (err) {
    throw Boom.badGateway(`Error calling service at ${url}: ${err}`);
  }

  if (fetched.status >= 400) {
    const contentType = fetched.headers.get('Content-Type').toLowerCase();
    const errorData = {
      target: url,
      status: fetched.status,
    };
    if (contentType.startsWith('application/json')) {
      errorData.message = await fetched.json().message;
    }

    throw Boom.badImplementation('Error calling CAF service.', errorData);
  }
  return fetched.json();
};
