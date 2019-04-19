import { get, insert, find, view } from '@cloudant/cloudant';
import * as store from './store';

jest.mock('winston');

describe('batch stores', () => {
  describe('when getting a batch by id', () => {
    test('it returns the item from stores', async () => {
      get.mockImplementationOnce(() => ({
        _id: '123',
        _rev: '456',
        data: 'datum',
      }));

      const result = await store.getById('123');
      expect(result).toMatchObject({
        id: '123',
        data: 'datum',
      });
      expect(get).toBeCalledWith('123');
    });

    test('it returns errors stores', async () => {
      get.mockImplementation(() => Promise.reject(Error('gone wrong')));

      await expect(store.getById('123:456')).rejects.toEqual(
        Error('gone wrong')
      );
      expect(get).toBeCalledWith('123');
    });
  });

  describe('when adding a batch', () => {
    test('it addUpdate an item to the stores', async () => {
      insert.mockImplementationOnce(() => ({
        id: '123',
        _rev: '456',
        ok: true,
      }));

      const result = await store.add({ data: '123:456' });
      expect(result).toMatchObject({
        id: '123',
        data: '123:456',
      });
      expect(insert).toBeCalledWith({ data: '123:456' });
    });

    test('it returns errors stores on failed request', async () => {
      insert.mockImplementationOnce(() => ({
        id: '123',
        _rev: '456',
        ok: false,
      }));

      await expect(store.add({ data: '123:456' })).rejects.toEqual(
        Error('Adding failed')
      );
      expect(insert).toBeCalledWith({ data: '123:456' });
    });

    test('it returns errors stores', async () => {
      insert.mockImplementation(() => Promise.reject(Error('gone wrong')));

      await expect(store.add({ data: '123:456' })).rejects.toEqual(
        Error('gone wrong')
      );
      expect(insert).toBeCalledWith({ data: '123:456' });
    });
  });

  describe('when adding a updateing', () => {
    test('it update an item to the stores', async () => {
      insert.mockImplementationOnce(() => ({
        id: '123',
        _rev: '456',
        ok: true,
      }));

      get.mockImplementationOnce(() => ({
        id: '123',
        _rev: '456',
      }));

      const result = await store.update({ data: '123:456' });
      expect(result).toMatchObject({
        id: '123',
        data: '123:456',
      });
      expect(insert).toBeCalledWith({ data: '123:456' });
    });

    test('it returns errors stores on failed request', async () => {
      insert.mockImplementationOnce(() => ({
        id: '123',
        _rev: '456',
        ok: false,
      }));

      get.mockImplementationOnce(() => ({
        id: '123',
        _rev: '456',
      }));

      await expect(store.update({ data: '123:456' })).rejects.toEqual(
        Error('Updating failed')
      );
      expect(insert).toBeCalledWith({ data: '123:456' });
    });

    test('it returns errors stores', async () => {
      insert.mockImplementation(() => Promise.reject(Error('gone wrong')));

      get.mockImplementationOnce(() => ({
        id: '123',
        _rev: '456',
      }));

      await expect(store.update({ data: '123:456' })).rejects.toEqual(
        Error('gone wrong')
      );
      expect(insert).toBeCalledWith({ data: '123:456' });
    });
  });

  describe('when searching', () => {
    test('it should return a review', async () => {
      find.mockImplementationOnce(() => ({
        docs: [
          {
            id: '123',
            _rev: '456',
            data: 'xyz',
          },
        ],
      }));

      const result = await store.search({ convId: '123' });
      expect(result).toMatchObject([
        {
          id: '123',
          data: 'xyz',
        },
      ]);
    });
  });

  describe('when getting a view tableau by conversation id', () => {
    test('it returns the records from stores', async () => {
      view.mockImplementationOnce(() => ({
        rows: [
          {
            id: '123',
            data: 'datum',
          },
        ],
      }));

      const result = await store.tableauByConvId('123');
      expect(result).toMatchObject([
        {
          id: '123',
          data: 'datum',
        },
      ]);
      expect(view).toBeCalledWith('reviews', 'tableauByConvId', {
        keys: `123`,
      });
    });

    test('it returns errors stores', async () => {
      view.mockImplementation(() => Promise.reject(Error('gone wrong')));

      await expect(store.tableauByConvId('123')).rejects.toEqual(
        Error('gone wrong')
      );
      expect(view).toBeCalledWith('reviews', 'tableauByConvId', {
        keys: `123`,
      });
    });
  });
});
