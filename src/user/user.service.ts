import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(
    userId: string,
    userName: string,
    socketId: string,
  ): Promise<User> {
    const existingUser = await this.userModel.findOne({ userId });
    if (existingUser) {
      existingUser.socketId = socketId;
      return existingUser.save();
    }
    const newUser = new this.userModel({ userId, userName, socketId });
    return newUser.save();
  }

  async removeUser(socketId: string): Promise<User> {
    return this.userModel.findOneAndDelete({ socketId });
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserById(userId: string): Promise<User> {
    return this.userModel.findOne({ userId }).exec();
  }
}
