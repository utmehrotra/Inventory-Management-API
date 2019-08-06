import { TokenManager } from '../modules/auth/token-manager';
import { HttpStatus } from '../modules/http-status';
import promiseHandler from '../helpers/promise-handler';
import formatAndSendResponse from '../helpers/format-response';


export class Authenticator {
    private static __instance: Authenticator;

    static get instance(): Authenticator {
        if (!this.__instance)
            this.__instance = new Authenticator();
        return this.__instance;
    }

    async isAuthorized(req, res, next) {
        const token = TokenManager.extractTokenFromRequest(req);
        if (!token) {
            return formatAndSendResponse({ error: 'Auth required' }, null, { res, headerStatus: HttpStatus.FORBIDDEN });
        }
        const [tokenErr, tokenPayload] = await promiseHandler(TokenManager.instance.verifyToken(token));
        if (tokenErr) {
            return formatAndSendResponse({ error: 'JWT Auth failed' }, null, { res, headerStatus: HttpStatus.FORBIDDEN });
        }
        req.userId = tokenPayload.user._id;
        next();
    }
}
