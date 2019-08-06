
import { ProductLogModel } from '../../models/product-log';
import ProductLog from './product-log.interface';
import {AppConstant} from '../../constants/app-constants'


export class ProductLogService {
  private static __instance: ProductLogService;

  static get instance() {
    if (!this.__instance) this.__instance = new ProductLogService();
    return this.__instance;
  }

  async create(product: ProductLog): Promise<ProductLog> {
    const productResponse = await ProductLogModel.create(product);
    return productResponse;
  }
  createQuery(query){
    let { page = 0, size = AppConstant.DEFAULT.SIZE } = query || {};
    const {pid = ''} = query || {};
    page = parseInt(page);
    size = parseInt(size);
    const from = (page) * size;
    const dbQuery = {
        criteria: {},
        options: { skip: from, limit: size },
    }
    if (pid !== '') {
      dbQuery.criteria['pid'] = pid;
    }
    return dbQuery;
  }

  translate(response){
    const translatedResponse = [];
    response.forEach(element => {
      translatedResponse.push({
        _id: element._id,
        pid: element.pid._id,
        productName: element.pid.name,
        uid: element.uid._id,
        user: element.uid.name,
        createdAt: element.createdAt,
        quantity: element.quantity,
        status: element.status
      })
    });
    return translatedResponse;
  }
  async findProductLogs(dbQuery): Promise<Array<ProductLog>> {
    const productResponse = await ProductLogModel.find({...dbQuery.criteria}, null, dbQuery.options)
        .populate([{
          path: 'pid',
          select: 'name',
      },
      {
        path: 'uid',
        select: 'name',
    }])
    return productResponse;
  }
  async getMetaData(dbQuery){
    const metaResponse = await ProductLogModel.find({...dbQuery.criteria}).count(); 
    return {size: metaResponse};
  }

}
