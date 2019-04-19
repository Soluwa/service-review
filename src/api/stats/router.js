import { Router } from 'express';

import * as service from './service';

export default () => {
  const router = Router();

  /**
   * @api {get} /stats/ get review
   * @apiGroup stats
   * @apiSampleRequest /stats
   *
   * @apiParam {string} start date.
   * @apiParam {string} end date.
   *
   * @apiSuccess (200) {json} review.
   * @apiSuccess (204) {json} success no records.
   */
  router.get('/:convId', async (req, res, next) => {
    try {
      const data = await service.tableauByConvId(req.params.convId, 'default');

      res.status(200).send(data);
    } catch (err) {
      next(err);
    }
  });

  /**
   * @api {get} /stats/ get review
   * @apiGroup stats
   * @apiSampleRequest /stats
   *
   * @apiParam {string} start date.
   * @apiParam {string} end date.
   *
   * @apiSuccess (200) {json} review.
   * @apiSuccess (204) {json} success no records.
   */
  router.get('/', async (req, res, next) => {
    try {
      const data = await service.tableauByDate(
        req.query.start,
        req.query.end,
        req.query.limit || 500,
        req.query.skip || 0,
        'default'
      );

      res.status(200).send(data);
    } catch (err) {
      next(err);
    }
  });

  /**
   * @api {get} /stats/grouped/intents
   * @apiGroup stats
   * @apiSampleRequest /stats
   *
   * @apiParam {string} start date.
   * @apiParam {string} end date.
   *
   * @apiSuccess (200) {json} review.
   * @apiSuccess (204) {json} success no records.
   */
  router.get('/grouped/intents/', async (req, res, next) => {
    try {
      const data = await service.groupedIntents(
        req.query.start,
        req.query.end,
        req.query.limit || 500,
        req.query.skip || 0
      );

      res.status(200).send(data);
    } catch (err) {
      next(err);
    }
  });

  /**
   * @api {get} /stats/grouped/events
   * @apiGroup stats
   * @apiSampleRequest /stats
   *
   * @apiParam {string} start date.
   * @apiParam {string} end date.
   *
   * @apiSuccess (200) {json} review.
   * @apiSuccess (204) {json} success no records.
   */
  router.get('/grouped/events/', async (req, res, next) => {
    try {
      const data = await service.groupedEvents(
        req.query.start,
        req.query.end,
        req.query.limit || 500,
        req.query.skip || 0,
        'default'
      );

      res.status(200).send(data);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
