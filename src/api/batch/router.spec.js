/* eslint-disable import/first, one-var */
import boom from 'boom';

jest.mock('express', () => ({
  Router: () => ({ get: jest.fn(), post: jest.fn() }),
}));
jest.mock('./service', () => ({
  getById: jest.fn(),
  createBatch: jest.fn(),
}));

jest.mock('winston');

import * as service from './service';
import batchRouter from './router';

describe('batch router', () => {
  describe('GET batch', () => {
    let router, handler, send, next, status;
    beforeEach(() => {
      jest.clearAllMocks();
      send = jest.fn();
      status = jest.fn(() => ({ send }));
      next = jest.fn();
      router = batchRouter();
      [[, handler]] = router.get.mock.calls;
    });

    describe('when making a valid GET request to /:id', () => {
      test('it should GET an array of items', async () => {
        service.getById.mockImplementationOnce(() => [
          { batchId: '123:456', conversations: [{ convId: '1234' }] },
        ]);
        await handler({ params: { id: '123:456' } }, { send, status }, next);
        expect(send).toHaveBeenCalledWith([
          { batchId: '123:456', conversations: [{ convId: '1234' }] },
        ]);
      });
    });

    describe('when making an invalid GET request to /:id', () => {
      test('it should return a input error', async () => {
        const err = new Error();
        err.statusCode = 403;
        service.getById.mockImplementationOnce(() => {
          throw err;
        });
        await handler({ params: { id: '123:456' } }, { send }, next);
        expect(next).toHaveBeenCalledWith(err);
      });
    });
  });

  describe('POST to /:convId', () => {
    let router, handler, send, next, status;
    beforeEach(() => {
      jest.clearAllMocks();
      send = jest.fn();
      status = jest.fn(() => ({ send }));
      next = jest.fn();
      router = batchRouter();
      [[, handler]] = router.post.mock.calls;
    });

    describe('when making a valid POST request to /:id', () => {
      test('it should POST a single item', async () => {
        service.createBatch.mockImplementationOnce(() => [
          { batchId: '123:456', conversations: [{ convId: '1234' }] },
        ]);
        await handler({ params: { id: '123:456' } }, { send, status }, next);
        expect(send).toHaveBeenCalledWith([
          { batchId: '123:456', conversations: [{ convId: '1234' }] },
        ]);
      });
    });

    describe('when making an invalid POST request to /:id', () => {
      test('it should return a input error', async () => {
        const err = new Error();
        err.statusCode = 403;
        service.createBatch.mockImplementationOnce(() => {
          throw err;
        });
        await handler({ params: { id: '123:456' } }, { send }, next);
        expect(next).toHaveBeenCalledWith(err);
      });
    });
  });

  describe('POST batch', () => {
    let router, handler, send, next, status;
    beforeEach(() => {
      jest.clearAllMocks();
      send = jest.fn();
      status = jest.fn(() => ({ send }));
      next = jest.fn();
      router = batchRouter();
      [, [, , handler]] = router.post.mock.calls;
    });

    describe('when making a valid POST request to /', () => {
      test('it should POST a array of conversations', async () => {
        service.createBatch.mockImplementationOnce(() => [
          { batchId: '123:456', conversations: [{ convId: '1234' }] },
        ]);
        await handler({ csvData: [{ Id: '1234' }] }, { send, status }, next);
        expect(send).toHaveBeenCalledWith([
          { batchId: '123:456', conversations: [{ convId: '1234' }] },
        ]);
      });
    });

    describe('when making an invalid POST request to /', () => {
      test('it should return a server error', async () => {
        service.createBatch.mockImplementationOnce(() => {
          throw new Error();
        });
        await handler({ csvData: [{ Id: '1234' }] }, { send, status }, next);
        expect(next).toHaveBeenCalledWith(new Error());
      });

      test('it should return a input error on no data', async () => {
        await handler({}, { send }, next);
        expect(next).toHaveBeenCalledWith(
          boom.badData('No conversations to create batch')
        );
      });

      test('it should return a input error on missing data', async () => {
        await handler({ csvData: [] }, { send }, next);
        expect(next).toHaveBeenCalledWith(
          boom.badData('No conversations to create batch')
        );
      });

      test('it should return a input error on to much data', async () => {
        const data = [];
        for (let i = 0; i < 510; i += 1) {
          data.push({ Id: '1234' });
        }

        await handler({ csvData: data }, { send }, next);
        expect(next).toHaveBeenCalledWith(
          boom.badData('Exceeded max conversations of 500')
        );
      });

      test('it should return a input error on to much data', async () => {
        const data = [];
        for (let i = 0; i < 20; i += 1) {
          data.push({ ConvId: '1234' });
        }

        await handler({ csvData: data }, { send }, next);
        expect(next).toHaveBeenCalledWith(boom.badData('Missing column Id'));
      });
    });
  });
});
