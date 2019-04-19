/* eslint-disable import/first */
jest.mock('../../../stores/context/store', () => ({
  getTableauByConvId: jest.fn(),
  getTableauByDate: jest.fn(),
}));

import boom from 'boom';
import * as store from '../../../stores/context/store';
import * as service from './service';

describe('stats service', () => {
  beforeEach(() => {
    jest.unmock('./service');
  });
  describe('when getting stats by conversation id', () => {
    it('it returns a list of stats', async () => {
      const stats = [
        {
          value: {
            HO_Agt_Swear: 1,
          },
        },
      ];

      store.getTableauByConvId.mockImplementationOnce(() => stats);

      await expect(
        service.tableauByConvId('1234', 'default')
      ).resolves.toMatchObject(stats[0].value);
    });

    it("rejects with 'Failed to get stats.' when id not matched", async () => {
      const err = new Error();
      err.statusCode = 404;
      store.getTableauByConvId.mockImplementationOnce(() => {
        throw err;
      });
      await expect(service.tableauByConvId('789')).rejects.toMatchObject(
        boom.notFound('Failed to get stats.')
      );
    });

    it("rejects with 'Failed to find conversation.' when id not found", async () => {
      const stats = [];
      store.getTableauByConvId.mockImplementationOnce(() => stats);

      await expect(
        service.tableauByConvId('789', 'default')
      ).rejects.toMatchObject(
        boom.notFound('Failed to get stats.: Failed to find conversation')
      );
    });
  });

  describe('when getting stats by conversation date', () => {
    it('it returns a list of stats', async () => {
      const stats = [
        {
          value: {
            HO_Agt_Swear: 1,
          },
        },
      ];

      store.getTableauByDate.mockImplementationOnce(() => stats);

      await expect(
        service.tableauByDate('1234', '12345', 1, 0, 'default')
      ).resolves.toMatchObject(stats);
    });

    it("rejects with 'Failed to get stats.' when id not matched", async () => {
      const err = new Error();
      err.statusCode = 404;
      store.getTableauByDate.mockImplementationOnce(() => {
        throw err;
      });
      await expect(
        service.tableauByDate('1234', '12345', 1, 0, 'default')
      ).rejects.toMatchObject(boom.notFound('Failed to get stats.'));
    });
  });
});
