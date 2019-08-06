
import { ProductModel } from '../../models/product';
import Product from './product.interface';
import {AppConstant} from '../../constants/app-constants'

interface ProductCriteria {
  _id: string,
  quantity?: any,
  status: boolean
}

export class ProductService {
  private static __instance: ProductService;

  static get instance() {
    if (!this.__instance) this.__instance = new ProductService();
    return this.__instance;
  }

  async create(product: Product): Promise<Product> {
    const productResponse = await ProductModel.create(product);
    return productResponse;
  }

  async findProducts(dbQuery): Promise<Array<Product>>{
    const productResponse = await ProductModel.find({...dbQuery.criteria, status: true}, null, dbQuery.options).select(dbQuery.projections); 
    return productResponse;
  }

  async updateProductQuantity({pid, inc}): Promise<Product>{
    const productCriteria: ProductCriteria = {_id: pid, status: true};
    if(inc < 0){
      productCriteria.quantity = {$gte: Math.abs(inc)}
    }
    const productResponse = await ProductModel.findOneAndUpdate(productCriteria, {$inc:{ quantity: inc}}, {new: true}); 
    return productResponse;
  }

  async delete({id}){
    const productResponse = await ProductModel.findOneAndUpdate({_id: id, status: true}, {$set: {status: false}}, {new: true}); 
    return productResponse;
  }

  async getMetaData(dbQuery){
    const metaResponse = await ProductModel.find({...dbQuery.criteria, status: true}).count(); 
    return {size: metaResponse};
  }

  createQuery(query){
    let { page = 0, size = AppConstant.DEFAULT.SIZE } = query || {};
    const {name = '', quantity = '2'} = query || {};
    page = parseInt(page);
    size = parseInt(size);
    const from = (page) * size;
    const dbQuery = {
        criteria: {},
        options: { skip: from, limit: size },
        projections: AppConstant.PRODUCT.DEFAULT.PROJECTION
    }
    if (name !== '') {
      dbQuery.criteria['name'] = new RegExp(name, 'i');
    }
    if(quantity === '1'){
      dbQuery.criteria['quantity'] = {$gte: 1};
    }else if(quantity === '0'){
      dbQuery.criteria['quantity'] = 0;
    }
    return dbQuery;
}
}
