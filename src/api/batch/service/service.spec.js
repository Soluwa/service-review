/* eslint-disable import/first */
jest.mock('../../../connectors/context/context', () => ({
  getConversations: jest.fn(),
}));

jest.mock('winston');

jest.mock('../../../stores/review/store', () => ({
  getById: jest.fn(),
  add: jest.fn(),
  search: jest.fn(),
}));

import boom from 'boom';
import * as store from '../../../stores/review/store';
import * as service from './service';
import * as context from '../../../connectors/context/context';

describe('batch service', () => {
  beforeEach(() => {
    jest.unmock('./service');
  });
  describe('when getting batch conversations that none have been reviewed', () => {
    it('it returns a batch object with conversation', async () => {
      const input = {
        conversations: [
          {
            convId: '1234',
            firstTurn: '',
          },
        ],
        type: 'batch',
      };

      const outcome = {
        conversations: [
          {
            convId: '1234',
            reviewStatus: false,
            firstTurn: '',
          },
        ],
        type: 'batch',
      };

      store.getById.mockImplementationOnce(() => input);
      store.search.mockImplementationOnce(() => []);

      await expect(service.getById('1234')).resolves.toMatchObject(outcome);
    });

    it('it returns a batch object with conversation and review', async () => {
      const input = {
        conversations: [
          {
            convId: '1234',
            firstTurn: '',
          },
        ],
        type: 'batch',
      };

      const outcome = {
        conversations: [
          {
            convId: '1234',
            reviewStatus: true,
            firstTurn: '',
          },
        ],
        type: 'batch',
      };

      store.getById.mockImplementationOnce(() => input);
      store.search.mockImplementationOnce(() => [{ convId: '1234' }]);

      await expect(service.getById('1234')).resolves.toMatchObject(outcome);
    });

    it("rejects with 'Failed to get batch.' when id not matched", async () => {
      const err = new Error();
      err.statusCode = 404;
      store.getById.mockImplementationOnce(() => {
        throw err;
      });
      await expect(service.getById('789')).rejects.toMatchObject(
        boom.notFound('Failed to get a batch.')
      );
    });

    it('rejects when something has gone wrong', async () => {
      const err = new Error();
      store.getById.mockImplementationOnce(() => {
        throw err;
      });
      await expect(service.getById('789')).rejects.toMatchObject(
        boom.internal('Failed to get a batch.', err)
      );
    });
  });

  describe('when creating batch with no missing conversations.', () => {
    it('it returns a batch object with conversations', async () => {
      const conversationIds = ['1234'];
      const input = {
        conversations: [
          {
            convId: '1234',
            firstTurn: 'abc',
          },
        ],
        type: 'batch',
      };
      const outcome = {
        batch: {
          conversations: [
            { convId: '1234', reviewStatus: true, firstTurn: 'abc' },
          ],
          type: 'batch',
        },
        missing: [],
      };

      context.getConversations.mockImplementationOnce(() => [
        {
          convId: '1234',
          firstTurn: 'abc',
        },
      ]);
      store.search.mockImplementationOnce(() => [{ convId: '1234' }]);

      store.add.mockImplementationOnce(() => input);
      await expect(service.createBatch(conversationIds)).resolves.toMatchObject(
        outcome
      );
    });
  });

  describe('when creating batch conversations with missing records', () => {
    it('it returns a batch object with conversations only in context', async () => {
      const conversationIds = ['1234', '12345'];
      const input = {
        conversations: [
          {
            convId: '1234',
            firstTurn: 'abc',
          },
        ],
        type: 'batch',
      };
      const outcome = {
        batch: {
          conversations: [
            { convId: '1234', reviewStatus: true, firstTurn: 'abc' },
          ],
          type: 'batch',
        },
        missing: ['12345'],
      };

      context.getConversations.mockImplementationOnce(() => [
        {
          convId: '1234',
          firstTurn: 'abc',
        },
      ]);
      store.search.mockImplementationOnce(() => [{ convId: '1234' }]);

      store.add.mockImplementationOnce(() => input);
      await expect(service.createBatch(conversationIds)).resolves.toMatchObject(
        outcome
      );
    });
  });

  describe('when creating batch conversations with no records', () => {
    it('it should error with no records to create batch', async () => {
      const conversationIds = ['1234', '12345'];
      const input = {
        conversations: [
          {
            convId: '1234',
            firstTurn: 'abc',
          },
        ],
        type: 'batch',
      };

      context.getConversations.mockImplementationOnce(() => []);
      store.search.mockImplementationOnce(() => []);

      store.add.mockImplementationOnce(() => input);
      await expect(service.createBatch(conversationIds)).rejects.toMatchObject(
        boom.notFound('Could not find any valid records')
      );
    });
  });
});
