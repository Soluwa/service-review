import * as service from './service';
import batchRouter from './router';

jest.mock('express', () => ({
  Router: () => ({ get: jest.fn(), post: jest.fn(), put: jest.fn() }),
}));
jest.mock('./service', () => ({
  getById: jest.fn(),
  add: jest.fn(),
  update: jest.fn(),
  search: jest.fn(),
  tableauByConvId: jest.fn(),
}));

describe('review router', () => {
  describe('GET review', () => {
    let router;
    let handler;
    let send;
    let next;
    let status;
    beforeEach(() => {
      jest.clearAllMocks();
      send = jest.fn();
      status = jest.fn(() => ({ send }));
      next = jest.fn();
      router = batchRouter();
      [[, , handler]] = router.get.mock.calls;
    });

    describe('when making a valid GET request to /:id', () => {
      test('it should GET an array of items', async () => {
        service.getById.mockImplementationOnce(() => ({
          id: 'test-1',
          conversationRating: 'good',
          type: 'review',
        }));
        await handler({ params: { id: '123:456' } }, { send, status }, next);
        expect(send).toHaveBeenCalledWith({
          id: 'test-1',
          conversationRating: 'good',
          type: 'review',
        });
      });

      test('it should GET an array of items', async () => {
        service.getById.mockImplementationOnce(() => undefined);
        await handler({ params: { id: '123:456' } }, { send, status }, next);
        expect(send).toHaveBeenCalledWith(undefined);
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

  describe('POST tableau', () => {
    let router;
    let handler;
    let send;
    let next;
    let status;
    beforeEach(() => {
      jest.clearAllMocks();
      send = jest.fn();
      status = jest.fn(() => ({ send }));
      next = jest.fn();
      router = batchRouter();
      [, [, handler]] = router.post.mock.calls;
    });

    describe('when making a valid GET request to /tableauByConvId', () => {
      test('it should GET an array of items', async () => {
        service.tableauByConvId.mockImplementationOnce(() => ({
          id: 'test-1',
          conversationRating: 'good',
          type: 'review',
        }));
        await handler({ body: { id: '123:456' } }, { send, status }, next);
        expect(send).toHaveBeenCalledWith({
          id: 'test-1',
          conversationRating: 'good',
          type: 'review',
        });
      });
    });

    describe('when making an invalid GET request to /tableauByConvId', () => {
      test('it should return a input error', async () => {
        const err = new Error();
        err.statusCode = 403;
        service.tableauByConvId.mockImplementationOnce(() => {
          throw err;
        });
        await handler({ body: { id: '123:456' } }, { send }, next);
        expect(next).toHaveBeenCalledWith(err);
      });
    });
  });

  describe('GET review list', () => {
    let router;
    let handler;
    let send;
    let next;
    let status;
    beforeEach(() => {
      jest.clearAllMocks();
      send = jest.fn();
      status = jest.fn(() => ({ send }));
      next = jest.fn();
      router = batchRouter();
      [, [, , handler]] = router.get.mock.calls;
    });

    describe('when making a valid GET request to /', () => {
      test('it should GET an array of items', async () => {
        service.search.mockImplementationOnce(() => [
          {
            id: 'test-1',
            conversationRating: 'good',
            type: 'review',
          },
        ]);
        await handler({ query: { id: '123:456' } }, { send, status }, next);
        expect(send).toHaveBeenCalledWith([
          {
            id: 'test-1',
            conversationRating: 'good',
            type: 'review',
          },
        ]);
      });
    });

    describe('when making a valid GET request to / but no data', () => {
      test('it should give 204', async () => {
        service.search.mockImplementationOnce(() => []);
        await handler({ query: { id: '123:456' } }, { send, status }, next);
        expect(status).toHaveBeenCalledWith(204);
      });
    });

    describe('when making an invalid GET request to /', () => {
      test('it should return a input error', async () => {
        const err = new Error();
        err.statusCode = 403;
        service.search.mockImplementationOnce(() => {
          throw err;
        });
        await handler({ query: { id: '123:456' } }, { send }, next);
        expect(next).toHaveBeenCalledWith(err);
      });
    });
  });

  describe('POST review', () => {
    let router;
    let handler;
    let send;
    let next;
    let status;
    beforeEach(() => {
      jest.clearAllMocks();
      send = jest.fn();
      status = jest.fn(() => ({ send }));
      next = jest.fn();
      router = batchRouter();
      [[, , handler]] = router.post.mock.calls;
    });

    describe('when making a valid POST request to /', () => {
      test('it should POST a review', async () => {
        service.add.mockImplementationOnce(() => ({
          id: 'test-1',
          conversationRating: 'good',
          type: 'review',
        }));

        await handler(
          { body: 'data', user: { userId: 1 } },
          { send, status },
          next
        );
        expect(send).toHaveBeenCalledWith({
          id: 'test-1',
          conversationRating: 'good',
          type: 'review',
        });
      });
    });

    describe('when making an invalid POST request to /', () => {
      test('it should return a server error', async () => {
        service.add.mockImplementationOnce(() => {
          throw new Error();
        });
        await handler({ user: { userId: 1 } }, { send, status }, next);
        expect(next).toHaveBeenCalledWith(new Error());
      });
    });
  });

  describe('PUT review', () => {
    let router;
    let handler;
    let send;
    let next;
    let status;
    beforeEach(() => {
      jest.clearAllMocks();
      send = jest.fn();
      status = jest.fn(() => ({ send }));
      next = jest.fn();
      router = batchRouter();
      [[, , handler]] = router.put.mock.calls;
    });

    describe('when making a valid PUT request to /', () => {
      test('it should PUT a review', async () => {
        service.update.mockImplementationOnce(() => ({
          id: 'test-1',
          conversationRating: 'good',
          type: 'review',
        }));

        await handler(
          { test: 'data', user: { userId: 1 } },
          { send, status },
          next
        );
        expect(send).toHaveBeenCalledWith({
          id: 'test-1',
          conversationRating: 'good',
          type: 'review',
        });
      });
    });

    describe('when making an invalid PUT request to /', () => {
      test('it should return a server error', async () => {
        service.update.mockImplementationOnce(() => {
          throw new Error();
        });
        await handler({ user: { userId: 1 } }, { send, status }, next);
        expect(next).toHaveBeenCalledWith(new Error());
      });
    });
  });
});
