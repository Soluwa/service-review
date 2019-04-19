import * as service from './service';
import statsRouter from './router';

jest.mock('express', () => ({
  Router: () => ({ get: jest.fn(), post: jest.fn(), put: jest.fn() }),
}));
jest.mock('./service', () => ({
  tableauByConvId: jest.fn(),
  tableauByDate: jest.fn(),
}));

describe('stats router', () => {
  describe('GET stats by conversation id', () => {
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
      router = statsRouter();
      [[, handler]] = router.get.mock.calls;
    });

    describe('when making a valid GET request to /:id', () => {
      test('it should GET an array of items', async () => {
        service.tableauByConvId.mockImplementationOnce(() => [
          {
            id: 'test-1',
            conversationRating: 'good',
            type: 'review',
          },
        ]);
        await handler(
          { params: { convId: '123:456' } },
          { send, status },
          next
        );
        expect(send).toHaveBeenCalledWith([
          {
            id: 'test-1',
            conversationRating: 'good',
            type: 'review',
          },
        ]);
      });
    });

    describe('when making an invalid GET request to /:id', () => {
      test('it should return a input error', async () => {
        const err = new Error();
        err.statusCode = 403;
        service.tableauByConvId.mockImplementationOnce(() => {
          throw err;
        });
        await handler({ params: { convId: '123:456' } }, { send }, next);
        expect(next).toHaveBeenCalledWith(err);
      });
    });
  });

  describe('GET stats by date', () => {
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
      router = statsRouter();
      [, [, handler]] = router.get.mock.calls;
    });

    describe('when making a valid GET request to /', () => {
      test('it should GET an array of items', async () => {
        service.tableauByDate.mockImplementationOnce(() => [
          {
            id: 'test-1',
            conversationRating: 'good',
            type: 'review',
          },
        ]);
        await handler(
          { query: { start: 'date', end: 'date', limit: 1, skip: 1 } },
          { send, status },
          next
        );
        expect(send).toHaveBeenCalledWith([
          {
            id: 'test-1',
            conversationRating: 'good',
            type: 'review',
          },
        ]);
      });
    });

    describe('when making an invalid GET request to /:id', () => {
      test('it should return a input error', async () => {
        const err = new Error();
        err.statusCode = 403;
        service.tableauByDate.mockImplementationOnce(() => {
          throw err;
        });
        await handler(
          { query: { start: 'date', end: 'date' } },
          { send },
          next
        );
        expect(next).toHaveBeenCalledWith(err);
      });
    });
  });
});
