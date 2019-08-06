import { LoggerContainer } from './modules/logger/logger-container';
import { HttpStatus } from './modules/http-status';
import UserController from './api/user-controller';
import ProductController from './api/product-controller';
import { Authenticator } from './middleware/authenticator';


const logger = LoggerContainer.instance.getLogger('Router');
const authenticator = Authenticator.instance;

const userController = new UserController();
const productController = new ProductController();
export function attachApplicationRoutes(app) {

  app.use((req, res, next) =>{
    logger.debug('Processing route: %s', req.url);
    next();
  });

  app.get('/health', (req, res) =>{
    logger.debug('I am healthy.');
    res.send(HttpStatus.OK, {healthy: true});
  });
  // User routes
  app.post('/user/signup', userController.signUp);
  app.post('/user/login', userController.login);

  // Product routes
  app.get('/products', authenticator.isAuthorized, productController.list);
  app.post('/products', authenticator.isAuthorized, productController.create);
  app.put('/products/:id/quantity', authenticator.isAuthorized, productController.updateQuantity);
  app.del('/products/:id', authenticator.isAuthorized, productController.removeProduct);
}
