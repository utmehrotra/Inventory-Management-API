import { UserModel } from '../../models/user';
import User from './user.interface';
import {AppConstant} from '../../constants/app-constants'

interface UserCriteria {
    password?: string,
    email: string,
    status: boolean,
    isADmin?: boolean
}

export class UserService {
  private static __instance: UserService;

  static get instance() {
    if (!this.__instance) this.__instance = new UserService();
    return this.__instance;
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = await UserModel.findOne({
      _id: userId, status: true, isAdmin: true
    });
    if (!user) return false;
    return true;
  }

  async ifUserExists(email: string, password?: string): Promise<boolean> {
    let criteria:UserCriteria = { email, status: true };
    if(password){
        criteria = {...criteria, password}
    }
    const user = await UserModel.findOne(criteria);
    if (!user) {
        return false;
    }
    return true;
  }

  async getUserObj(email: string, password?: string): Promise<User> {
    let criteria:UserCriteria = { email, status: true };
    if(password){
        criteria = {...criteria, password}
    }
    const user = await UserModel.findOne(criteria).select(AppConstant.USER.DEFAULT.PROJECTION);
    return user;
  }

  async createUser(user: User): Promise<User> {
    const userResponse = await UserModel.create(user);
    return userResponse;
  }
}
