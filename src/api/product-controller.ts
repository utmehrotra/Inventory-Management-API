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
        const productService = ProductService.instance;
        const [err, response] = await pHandler(productService.create({name, quantity, price}));
        if(!err){
            if(quantity === 0){
                warning.push(AppConstant.PRODUCT.WARNING.QUANTITY)
            }
            if(price === 0){
                warning.push(AppConstant.PRODUCT.WARNING.FREE)
            }
            return formatAndSendResponse(null, response, {res, warning});
        }else{
            return formatAndSendResponse(err, null, {res});
        }
    }
    async list(req, res){
        const productService = ProductService.instance;
        const dbQuery = productService.createQuery(req.query);
        const response = await productService.findProducts(dbQuery);
        const metaResponse = await productService.getMetaData(dbQuery);
        return formatAndSendResponse(null, response, {
            res, message: 'List of products', 
            meta: {total: metaResponse.size, itemsOnPage:response.length}
        });
    }
    async updateQuantity(req, res){
        const {inc} = req.body;
        const {id} = req.params;
        const adminId = req.userId;

        const productService = ProductService.instance;
        const productLogService = ProductLogService.instance;
        const updatedResp = await productService.updateProductQuantity({pid:  id, inc});
        if(updatedResp){
            const logResp = await productLogService.create({pid: id, quantity: inc, uid: adminId});
            return formatAndSendResponse(null, updatedResp, {
                res, message: 'The product quantity has been changed'
            });
        }else{
            return formatAndSendResponse({message: AppConstant.ERROR_MESSAGE.PRODUCT.MISSING_EMPTY}, updatedResp, {
                res, headerStatus: HttpStatus.BAD_REQUEST
            });
        }

    }

    async removeProduct(req, res){
        const {id} = req.params;
        const adminId = req.userId;
        const productService = ProductService.instance;
        const productLogService = ProductLogService.instance;
        const deletedResp = await productService.delete({id});
        if(deletedResp){
            const logResp = await productLogService.create({pid: id, status: false, uid: adminId});
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
