import jwt from 'jsonwebtoken';
import { LoggerContainer } from '../logger/logger-container';

declare interface TokenPayload {
  user: { [key: string]: any };
}

const logger = LoggerContainer.instance.getLogger('TokenManager');
const INSTANCE = Symbol('TokenManager');

export const TOKEN_HEADER_KEYS = ['auth-token', 'x-auth-token', 'jwt'];
export const TOKEN_QUERY_KEY = 'auth_token';

export class TokenManager {
  private _passphrase: String;
  private _tokenExpiresIn: Number;

  static get instance(): TokenManager {
    if (!this[INSTANCE]) {
      this[INSTANCE] = new TokenManager();
    }
    return this[INSTANCE];
  }

  static extractTokenFromRequest(
    request,
    headerKeys = TOKEN_HEADER_KEYS,
    queryKey = TOKEN_QUERY_KEY
  ) {
    let token = '';
    if (request.query && request.query[queryKey]) {
      return request.query[queryKey];
    }
    if (request.headers) {
      for (const headerKey of headerKeys) {
        if (request.headers[headerKey]) {
          token = request.headers[headerKey];
          break;
        }
      }
    }
    return token;
  }

  /** Alias for static method */
  extractTokenFromRequest(
    request,
    headerKeys = TOKEN_HEADER_KEYS,
    queryKey = TOKEN_QUERY_KEY
  ){
    return TokenManager.extractTokenFromRequest(request, headerKeys, queryKey);
  }

  setExpiresIn(value: number) {
    this._tokenExpiresIn = value;
    return this;
  }

  setJWTPassword(value: String) {
    this._passphrase = value;
    return this;
  }
  

  async createToken(payload: TokenPayload) {
    const token = jwt.sign(payload, this._passphrase, { expiresIn: this._tokenExpiresIn});
    logger.info('TokenData stored for user %s', payload.user._id);
    return token;
  }

  async verifyToken(token) {
    let payload: TokenPayload;
    try {
      payload = await jwt.verify(token, this._passphrase);
      logger.debug('User token is valid: ', payload);
    } catch (e) {
      logger.debug('Failed tp verify user token.', e);
      throw new Error(e);
    }
    return payload;
  }
}

export function initTokenManager({ tokenExpiresIn, password }): TokenManager {
  const manager = TokenManager.instance;
  
  manager.setJWTPassword(password).setExpiresIn(tokenExpiresIn);

  return manager;
}
