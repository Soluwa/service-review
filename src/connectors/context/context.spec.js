/* eslint-disable import/first */
jest.mock('node-fetch');
jest.mock('../connectors-helper');

import { getConversation, getConversations } from './context';

import request from '../connectors-helper';

beforeEach(() => {
  request.mockImplementation(() => ({ val: 'TEST' }));
});

describe('get Conversations', async () => {
  test('should return conversations call', async () => {
    // Arrange
    expect.assertions(1);

    // Act
    const res = await getConversations({}, request);

    // Assert
    expect(res.val).toBe('TEST');
  });
});

describe('get Conversation', async () => {
  test('should return conversation call', async () => {
    // Arrange
    expect.assertions(1);

    // Act
    const res = await getConversation({}, request);

    // Assert
    expect(res.val).toBe('TEST');
  });
});
