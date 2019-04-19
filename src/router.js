import { Router } from 'express';
import { apiRouter } from './api';

export default () => {
  const router = Router();

  router.use('/', apiRouter());

  return router;
};
