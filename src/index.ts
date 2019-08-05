process.chdir(__dirname);
import 'source-map-support/register'
import restify from 'restify';
import applicationConfig from './config/config';
import { MongoConnector } from './modules/mongo-connector';


const mongoConnector = new MongoConnector();
const app = restify.createServer({
  name: 'Inventory Management API',
  version: '0.0.1'
});


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


(async () => {
  await mongoConnector.connect();
  app.listen(applicationConfig.port, () => {
    console.log(`Application started on ${applicationConfig.port}`);
  });
})();

app.on('uncaughtException', (req, res, route, err) => {
  
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  
  process.exit(1);
});
