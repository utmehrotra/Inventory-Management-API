import { LoggerContainer } from './modules/logger/logger-container';
import { HttpStatus } from './modules/http-status';
import UserController from './api/user-controller';



const logger = LoggerContainer.instance.getLogger('Router');
const userController = new UserController();
export function attachApplicationRoutes(app) {

  app.use((req, res, next) =>{
    logger.debug('Processing route: %s', req.url);
    next();
  });

  app.get('/health', (req, res) =>{
    logger.debug('I am healthy.');
    res.send(HttpStatus.OK, {healthy: true});
  });
  app.post('/user/signup', userController.signUp);
  app.post('/user/login', userController.login);
}
