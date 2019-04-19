import logger, { setLogInfo } from 'sc-caf-module-logger';
import app from './app';

setLogInfo();
const { PORT = 3201 } = process.env;

app.listen(PORT, () =>
  logger('start', global.logInfo).info(`App listening on port ${PORT}`)
);
