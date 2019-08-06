process.chdir(__dirname);
import 'source-map-support/register'
import restify from 'restify';
import corsMiddleware from 'restify-cors-middleware';
import applicationConfig from './config/config';
import { MongoConnector } from './modules/mongo-connector';
import { LoggerContainer } from './modules/logger/logger-container';
import { attachApplicationRoutes } from './routes';
import { initTokenManager } from './modules/auth/token-manager';

const logger = LoggerContainer.instance
  .setDefaultLevel(applicationConfig.logLevel)
  .createLogger('Application');
const mongoConnector = new MongoConnector();
const app = restify.createServer({
  name: 'Inventory Management API',
  version: '0.0.1'
});
logger.info(`Application configuration: `, applicationConfig);
const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['*'], // TODO: move to config
  allowHeaders: ['auth-token', 'x-auth-token', 'content-type', 'jwt', 'x-jwt']
});

initTokenManager({
    tokenExpiresIn: applicationConfig.jwt.expiry,
    password: applicationConfig.jwt.password
});
app.pre(cors.preflight);
app.use(restify.plugins.acceptParser(app.acceptable));
app.use(restify.plugins.gzipResponse());
app.pre(restify.plugins.pre.sanitizePath());
app.use(restify.plugins.queryParser({ mapParams: true }));
app.use(restify.plugins.jsonBodyParser({ mapParams: true }));

app.use(function crossOrigin(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Content-Length, X-Requested-With, jwt'
  );
  return next();
});

app.get(
  '//public/?.*/',
  restify.plugins.serveStatic({
    directory: __dirname
  })
);

mongoConnector.setConfig(applicationConfig.mongoDb);
attachApplicationRoutes(app);

(async () => {
  await mongoConnector.connect();
  app.listen(applicationConfig.port, () => {
    logger.info(`Application started on http://localhost:${applicationConfig.port}`);
  });
})();

app.on('uncaughtException', (req, res, route, err) => {
    logger.warn('Uncaught process exception: ', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection:', reason);
  process.exit(1);
});
