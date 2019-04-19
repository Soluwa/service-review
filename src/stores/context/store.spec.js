import { view } from '@cloudant/cloudant';
import * as store from './store';

jest.mock('winston');

describe('context store', () => {
  describe('when getting a view tableau by date', () => {
    test('it returns the records from stores', async () => {
      view.mockImplementationOnce(() => ({
        rows: [
          {
            id: '123',
            data: 'datum',
          },
        ],
      }));

      const result = await store.getTableauByDate('123', '1234', 1, 1);
      expect(result).toMatchObject([
        {
          id: '123',
          data: 'datum',
        },
      ]);
      expect(view).toBeCalledWith('reports', 'tableauByDate', {
        start_key: `"123"`,
        end_key: `"1234"`,
        limit: 1,
        skip: 1,
      });
    });

    test('it returns errors stores', async () => {
      view.mockImplementation(() => Promise.reject(Error('gone wrong')));

      await expect(store.getTableauByDate('123', '1234', 1, 1)).rejects.toEqual(
        Error('gone wrong')
      );
      expect(view).toBeCalledWith('reports', 'tableauByDate', {
        start_key: `"123"`,
        end_key: `"1234"`,
        limit: 1,
        skip: 1,
      });
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

      const result = await store.getTableauByConvId('123');
      expect(result).toMatchObject([
        {
          id: '123',
          data: 'datum',
        },
      ]);
      expect(view).toBeCalledWith('reports', 'tableauByConvId', {
        key: `123`,
      });
    });

    test('it returns errors stores', async () => {
      view.mockImplementation(() => Promise.reject(Error('gone wrong')));

      await expect(store.getTableauByConvId('123')).rejects.toEqual(
        Error('gone wrong')
      );
      expect(view).toBeCalledWith('reports', 'tableauByConvId', {
        key: `123`,
      });
    });
  });
});
