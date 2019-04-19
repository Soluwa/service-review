/* eslint-disable import/first */
jest.mock('../../../stores/review/store', () => ({
  getById: jest.fn(),
  add: jest.fn(),
  search: jest.fn(),
  update: jest.fn(),
  tableauByConvId: jest.fn(),
}));

import boom from 'boom';
import * as store from '../../../stores/review/store';
import * as service from './service';

describe('review service', () => {
  beforeEach(() => {
    jest.unmock('./service');
  });
  describe('when getting review conversations.', () => {
    it('it returns a review object', async () => {
      const testBatch = {
        id: 'test-1',
        conversationRating: 'good',
        type: 'review',
      };

      store.getById.mockImplementationOnce(() => testBatch);
      await expect(service.getById('1234')).resolves.toMatchObject(testBatch);
    });

    it("rejects with 'Failed to get batch.' when id not matched", async () => {
      const err = new Error();
      err.statusCode = 404;
      store.getById.mockImplementationOnce(() => {
        throw err;
      });
      await expect(service.getById('789')).rejects.toMatchObject(
        boom.notFound('Failed to get a review.')
      );
    });

    it('rejects when something has gone wrong', async () => {
      const err = new Error();
      store.getById.mockImplementationOnce(() => {
        throw err;
      });
      await expect(service.getById('789')).rejects.toMatchObject(
        boom.internal('Failed to get a review.', err)
      );
    });
  });

  describe('when getting tableau report by conversation', () => {
    it('it returns a report', async () => {
      const testBatch = [
        {
          id: 'test-1',
          conversationRating: 'good',
          type: 'review',
        },
      ];

      store.tableauByConvId.mockImplementationOnce(() => testBatch);
      await expect(service.tableauByConvId('1234')).resolves.toMatchObject(
        testBatch
      );
    });

    it("rejects with 'Failed to get batch.' when id not matched", async () => {
      const err = new Error();
      err.statusCode = 404;
      store.tableauByConvId.mockImplementationOnce(() => {
        throw err;
      });
      await expect(service.tableauByConvId('789')).rejects.toMatchObject(
        boom.notFound('Failed to get a review.')
      );
    });

    it('rejects when something has gone wrong', async () => {
      const err = new Error();
      store.tableauByConvId.mockImplementationOnce(() => {
        throw err;
      });
      await expect(service.tableauByConvId('789')).rejects.toMatchObject(
        boom.internal('Failed to get a review.', err)
      );
    });
  });

  describe('when getting review conversations list.', () => {
    it('it returns a review object list', async () => {
      const testBatch = [
        {
          id: 'test-1',
          conversationRating: 'good',
          type: 'review',
        },
      ];

      store.search.mockImplementationOnce(() => testBatch);
      await expect(service.search('1234')).resolves.toMatchObject(testBatch);
    });

    it("rejects with 'Failed to get batch.' when id not matched", async () => {
      const err = new Error();
      err.statusCode = 404;
      store.search.mockImplementationOnce(() => {
        throw err;
      });
      await expect(service.search('789')).rejects.toMatchObject(
        boom.notFound('Failed to get a review.')
      );
    });

    it('rejects when something has gone wrong', async () => {
      const err = new Error();
      store.search.mockImplementationOnce(() => {
        throw err;
      });
      await expect(service.search('789')).rejects.toMatchObject(
        boom.internal('Failed to get a review.', err)
      );
    });
  });

  describe('when updating a review.', () => {
    it('it returns a review object', async () => {
      const testBatch = {
        id: 'test-1',
        conversationRating: 'good',
        type: 'review',
      };

      store.update.mockImplementationOnce(() => testBatch);
      await expect(service.update('1234')).resolves.toMatchObject(testBatch);
    });

    it("rejects with 'Failed to get batch.' when id not matched", async () => {
      const err = new Error();
      err.statusCode = 404;
      store.update.mockImplementationOnce(() => {
        throw err;
      });
      await expect(service.update('789')).rejects.toMatchObject(
        boom.notFound('Failed to update review')
      );
    });

    it('rejects when something has gone wrong', async () => {
      const err = new Error();
      store.update.mockImplementationOnce(() => {
        throw err;
      });
      await expect(service.update('789')).rejects.toMatchObject(
        boom.internal('Failed to update review', err)
      );
    });
  });

  describe('when adding a review.', () => {
    it('it returns a review object', async () => {
      const testBatch = {
        id: 'test-1',
        conversationRating: 'good',
      };

      store.add.mockImplementationOnce(() => ({
        ...testBatch,
        ...{ type: 'review' },
      }));
      await expect(service.add('1234')).resolves.toMatchObject(testBatch);
    });

    it("rejects with 'Failed to get batch.' when id not matched", async () => {
      const err = new Error();
      err.statusCode = 404;
      store.add.mockImplementationOnce(() => {
        throw err;
      });
      await expect(service.add('789')).rejects.toMatchObject(
        boom.notFound('Failed to create review')
      );
    });

    it('rejects when something has gone wrong', async () => {
      const err = new Error();
      store.add.mockImplementationOnce(() => {
        throw err;
      });
      await expect(service.add('789')).rejects.toMatchObject(
        boom.internal('Failed to create review', err)
      );
    });
  });
});
