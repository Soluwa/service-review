import { Router } from 'express';
import { validateJwt } from 'sc-caf-middleware';

import * as service from './service';

export default () => {
  const router = Router();

  /**
   * @api {get} /review/ get review
   * @apiGroup batch
   * @apiSampleRequest /review/reviewId
   *
   * @apiParam {string} review reviewid.
   *
   * @apiSuccess (200) {json} review.
   * @apiSuccess (204) {json} success no records.
   */
  router.get(
    '/:id',
    validateJwt(process.env.JWT_SECRET),
    async (req, res, next) => {
      try {
        const data = await service.getById(req.params.id);

        res.status(200);
        if (!data || data.length === 0) {
          res.status(204);
        }

        res.send(data);
      } catch (err) {
        next(err);
      }
    }
  );

  /**
   * @api {get} /review/ get review
   * @apiGroup batch
   * @apiSampleRequest /review
   *
   * @apiParam {string} convId.
   *
   * @apiSuccess (200) {json} review.
   * @apiSuccess (204) {json} success no records.
   */
  router.get(
    '/',
    validateJwt(process.env.JWT_SECRET),
    async (req, res, next) => {
      try {
        const data = await service.search(req.query);

        res.status(200);
        if (!data || data.length === 0) {
          res.status(204);
        }

        res.send(data);
      } catch (err) {
        next(err);
      }
    }
  );

  /**
   * @api {post} /review/ get review
   * @apiGroup batch
   * @apiSampleRequest /review
   *
   * @body {list} convIds.
   *
   * @apiSuccess (200) {json} review records.
   */
  router.post(
    '/',
    validateJwt(process.env.JWT_SECRET),
    async (req, res, next) => {
      try {
        const data = await service.add(req.body, req.user.userId);

        res.status(200).send(data);
      } catch (err) {
        next(err);
      }
    }
  );

  /**
   * @api {post} /review/ post review
   * @apiGroup batch
   * @apiSampleRequest /review
   *
   * @apiSuccess (200) {json} review.
   */
  router.post('/tableauByConvId', async (req, res, next) => {
    try {
      // TODO add schema
      const data = await service.tableauByConvId(req.body);

      res.status(200).send(data);
    } catch (err) {
      next(err);
    }
  });

  /**
   * @api {post} /review/ post review
   * @apiGroup batch
   * @apiSampleRequest /review
   *
   * @apiSuccess (200) {json} review.
   */
  router.put(
    '/',
    validateJwt(process.env.JWT_SECRET),
    async (req, res, next) => {
      try {
        // TODO add schema
        const data = await service.update(req.body, req.user.userId);

        res.status(200).send(data);
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
};
