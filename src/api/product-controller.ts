import { ProductService } from '../modules/product/product-service';
import { ProductLogService } from '../modules/product-log/product-log-service';
import { AppConstant } from '../constants/app-constants';
import { HttpStatus } from '../modules/http-status';
import formatAndSendResponse from '../helpers/format-response';
import pHandler from '../helpers/promise-handler';

export default class ProductController {

    async create(req, res){
        const {name = '', quantity = 0, price = 0 } = req.body || {};
        if(name === ''){
            return formatAndSendResponse(AppConstant.ERROR_MESSAGE.MISSING.NAME, null, {headerStatus: HttpStatus.BAD_REQUEST, res })    
        }
        const warning = [];
        const productLogService = ProductLogService.instance;
        const productService = ProductService.instance;
        const [err, response] = await pHandler(productService.create({name, quantity, price}));
        if(!err){
            if(quantity === 0){
                warning.push(AppConstant.PRODUCT.WARNING.QUANTITY)
            }
            if(price === 0){
                warning.push(AppConstant.PRODUCT.WARNING.FREE)
            }
            await productLogService.create({pid: response._id, status: true, uid: req.userId, quantity});
            return formatAndSendResponse(null, response, {res, warning});
        }else{
            return formatAndSendResponse(err, null, {res});
        }
    }
    async list(req, res){
        const { page = 1 } = req.query || {};
        const productService = ProductService.instance;
        const dbQuery = productService.createQuery(req.query);
        const response = await productService.findProducts(dbQuery);
        const metaResponse = await productService.getMetaData(dbQuery);
        return formatAndSendResponse(null, response, {
            res, message: 'List of products', 
            meta: {total: metaResponse.size, itemsOnPage:response.length, page: parseInt(page) }
        });
    }
    async updateQuantity(req, res){
        const {inc = 0} = req.body || {};
        const {id} = req.params;
        const adminId = req.userId;

        if(inc === 0){
            return formatAndSendResponse(null, null, {
                res, message: AppConstant.ERROR_MESSAGE.MISSING.QUANTITY,
                headerStatus: HttpStatus.BAD_REQUEST
            });
        }
        const productService = ProductService.instance;
        const productLogService = ProductLogService.instance;
        const updatedResp = await productService.updateProductQuantity({pid:  id, inc});
        if(updatedResp){
            await productLogService.create({pid: id, quantity: inc, uid: adminId});
            return formatAndSendResponse(null, updatedResp, {
                res, message: 'The product quantity has been changed'
            });
        }else{
            return formatAndSendResponse(null, updatedResp, {
                res, headerStatus: HttpStatus.BAD_REQUEST, message: AppConstant.ERROR_MESSAGE.PRODUCT.MISSING_EMPTY
            });
        }

    }

    async removeProduct(req, res){
        const {id} = req.params;
        if(!id){
            return formatAndSendResponse(null, null, {
                res, message: AppConstant.ERROR_MESSAGE.MISSING.PRODUCT,
                headerStatus: HttpStatus.BAD_REQUEST
            });
        }
        const adminId = req.userId;
        const productService = ProductService.instance;
        const productLogService = ProductLogService.instance;
        const deletedResp = await productService.delete({id});
        if(deletedResp){
            await productLogService.create({pid: id, status: false, uid: adminId});
            return formatAndSendResponse(null, deletedResp, {
                res, message: 'The product is now deleted'
            });
        }else{
            return formatAndSendResponse({message: AppConstant.ERROR_MESSAGE.PRODUCT.ALREADY_DELETED}, deletedResp, {
                res, headerStatus: HttpStatus.BAD_REQUEST
            });
        }
        
    }
}
