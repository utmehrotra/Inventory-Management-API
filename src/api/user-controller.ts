import { UserService } from '../modules/user/user-service';
import { AppConstant } from '../constants/app-constants';
import { HttpStatus } from '../modules/http-status';
import { TokenManager } from '../modules/auth/token-manager';
import {isValidEmail, isValidPassword, md5} from '../helpers/utility';
import formatAndSendResponse from '../helpers/format-response';
import pHandler from '../helpers/promise-handler';

export default class UserController {
    async signUp(req, res){

        const {email = '', name = '', password = '' } = req.body || {};
        if(name === ''){
            return formatAndSendResponse(AppConstant.ERROR_MESSAGE.MISSING.NAME, null, {headerStatus: HttpStatus.BAD_REQUEST, res })    
        }
        if(!isValidEmail(email)){
            return formatAndSendResponse(AppConstant.ERROR_MESSAGE.MISSING.EMAIL, null, {headerStatus: HttpStatus.BAD_REQUEST, res })    
        }
        if(!isValidPassword(password)){
            return formatAndSendResponse(AppConstant.ERROR_MESSAGE.MISSING.PASSWORD, null, {headerStatus: HttpStatus.BAD_REQUEST, res})    
        }

        const userService = UserService.instance;
        const tokenManager = TokenManager.instance;
        const isAlreadyUser = await userService.ifUserExists(email);
        if(!isAlreadyUser){
            const encryptedPassword = md5(password);
            const [err, response] = await pHandler(userService.createUser({email, name, password: encryptedPassword}));
            if(!err){
                const user = {
                    _id: response._id,
                    name, 
                    email,
                    createdAt: response.createdAt
                };
                const jwtToken = await tokenManager.createToken({user});
                return formatAndSendResponse(null, {token: jwtToken, user}, {res, message: 'User created'});
            } else {
                return formatAndSendResponse(err, null, {res});
            }
            
        }else{
            return formatAndSendResponse(null, null, {headerStatus: HttpStatus.CONFLICT, res, message:AppConstant.ERROR_MESSAGE.USER.ALREADY_EXISTS});
        }
    }

    async login(req, res){
        const {email = '', password = '' } = req.body || {};
        
        if(!isValidEmail(email)){
            return formatAndSendResponse(AppConstant.ERROR_MESSAGE.MISSING.EMAIL, null, {headerStatus: HttpStatus.BAD_REQUEST, res })    
        }
        if(!isValidPassword(password)){
            return formatAndSendResponse(AppConstant.ERROR_MESSAGE.MISSING.PASSWORD, null, {headerStatus: HttpStatus.BAD_REQUEST, res})    
        }
        const userService = UserService.instance;
        const tokenManager = TokenManager.instance;
        const encryptedPassword = md5(password);
        const isAlreadyUser = await userService.ifUserExists(email);
        if(isAlreadyUser){
            const user = await userService.getUserObj(email);
            if(user.password === encryptedPassword){
                const jwtToken = await tokenManager.createToken({user});
                delete user.password;
                return formatAndSendResponse(null, {token: jwtToken, user}, {res, message: 'User created'});
            }else{
                return formatAndSendResponse(null, null, {
                    headerStatus: HttpStatus.CONFLICT, res, message: AppConstant.ERROR_MESSAGE.USER.EMAIL_PASSWORD_ERROR})        
            }
        }else{
            return formatAndSendResponse(null, null, {headerStatus: HttpStatus.CONFLICT, res, message:AppConstant.ERROR_MESSAGE.USER.DOESNT_EXISTS})    
        }
        
    }
}
