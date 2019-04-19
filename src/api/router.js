import { Router } from 'express';
import { batchRouter } from './batch';
import { reviewRouter } from './review';
import { statsRouter } from './stats';

export default () => {
  const router = Router();

  router.use('/batch', batchRouter());
  router.use('/review', reviewRouter());
  router.use('/stats', statsRouter());

  return router;
};
