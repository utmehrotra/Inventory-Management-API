import { ProductLogService } from '../modules/product-log/product-log-service';
import { AppConstant } from '../constants/app-constants';
import { HttpStatus } from '../modules/http-status';
import formatAndSendResponse from '../helpers/format-response';
import pHandler from '../helpers/promise-handler';

export default class ProductController {

    async list(req, res){
        const { page = 1, pid } = req.query || {};
        if(!pid){
            return formatAndSendResponse(null, null, {
                res, message: AppConstant.ERROR_MESSAGE.MISSING.PRODUCT,
                headerStatus: HttpStatus.BAD_REQUEST
            });
        }
        const productLogService = ProductLogService.instance;
        const dbQuery = productLogService.createQuery(req.query);
        const response = await productLogService.findProductLogs(dbQuery);
        const translatedResponse = productLogService.translate(response);
        const metaResponse = await productLogService.getMetaData(dbQuery);
        return formatAndSendResponse(null, translatedResponse, {
            res, message: 'List of product logs', 
            meta: {total: metaResponse.size, itemsOnPage:response.length, page: parseInt(page), pid  }
        });
    }
}
