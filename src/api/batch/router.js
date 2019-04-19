import { Router } from 'express';
import { map, findIndex } from 'lodash';
import boom from 'boom';
import winston from 'winston';

import * as service from './service';
import { parseCsv } from '../../middleware';

export default () => {
  const router = Router();

  /**
   * @api {get} /batchId/ get batch
   * @apiGroup batch
   * @apiSampleRequest /batch/batchId
   *
   * @apiParam {string} batchId batch id.
   *
   * @apiSuccess (200) {json} batch.
   */
  router.get('/:id', async (req, res, next) => {
    try {
      const data = await service.getById(req.params.id);

      // TODO Add review data
      // TODO Add context utterance / timestamp

      res.status(200).send(data);
    } catch (err) {
      next(err);
    }
  });

  /**
   * @api {get} /batchId/ get batch
   * @apiGroup batch
   * @apiSampleRequest /batch/batchId
   *
   * @apiParam {string} batchId batch id.
   *
   * @apiSuccess (200) {json} batch.
   */
  router.post('/:convId', async (req, res, next) => {
    try {
      const batch = await service.createBatch([req.params.convId]);
      res.status(200).send(batch);
    } catch (err) {
      winston.error('Failed to create batch', err);
      next(err);
    }
  });

  /**
   * @api {get} /batchId/ get batch
   * @apiGroup batch
   * @apiSampleRequest /batch/batchId
   *
   * @apiParam {string} batchId batch id.
   *
   * @apiSuccess (200) {json} batch.
   */
  router.post('/', parseCsv('conversations'), async (req, res, next) => {
    try {
      const records = req.csvData || [];

      if (records.length === 0) {
        next(boom.badData('No conversations to create batch'));
        return;
      }

      if (records.length > 500) {
        // TODO change to config driven
        next(boom.badData('Exceeded max conversations of 500'));
        return;
      }

      const conversationIds = map(records, 'Id');

      const exists = findIndex(conversationIds, record => record === undefined);

      if (exists !== -1) {
        next(boom.badData('Missing column Id'));
        return;
      }

      const batch = await service.createBatch(conversationIds);
      res.status(200).send(batch);
    } catch (err) {
      winston.error('Failed to upload file', err);
      next(err);
    }
  });

  return router;
};
