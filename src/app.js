import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import {
  errorHandler,
  serverStatus,
  isAllowed,
  logger as logMid,
} from 'sc-caf-middleware';
import router from './router';

const swaggerDocument = YAML.load(`${__dirname}/swagger.yaml`);

const started = new Date();
const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());
app.use(helmet());
app.use(logMid());
app.use(serverStatus(started));

// routes
if (process.env.NODE_ENV !== 'production') {
  app.use('/analysis', express.static('analysis'));
  app.use('/coverage', express.static('coverage/lcov-report'));
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/swagger', async (req, res) => res.send(swaggerDocument));
}

app.use(isAllowed());
app.use('/', router());

app.use(errorHandler());

export default app;
