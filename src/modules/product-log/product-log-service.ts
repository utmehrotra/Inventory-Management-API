
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

}
