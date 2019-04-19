/* eslint-disable import/first, no-template-curly-in-string */
jest.mock('node-fetch');

import fetch from 'node-fetch';

import request from './connectors-helper';

describe('Request ', async () => {
  test('calls fetch and returns json if okay', async () => {
    expect.assertions(1);
    fetch.mockImplementation(() => ({ status: 200, json: () => 'jason' }));

    expect(await request()).toEqual('jason');
  });
  test('throws if response is not 200 and error is a json', async () => {
    expect.assertions(1);
    const get = () => 'application/json';
    fetch.mockImplementation(() => ({
      status: 666,
      headers: { get },
      json: () => 'jason',
    }));

    const response = request('hi');
    expect(response).rejects.toEqual(Error('Error calling CAF service.'));
  });
  test('throws if non-json error', async () => {
    expect.assertions(1);

    const get = () => 'application/text';
    fetch.mockImplementation(() => ({
      status: 666,
      headers: { get },
    }));

    const response = request('hi');
    expect(response).rejects.toEqual(Error('Error calling CAF service.'));
  });
});
