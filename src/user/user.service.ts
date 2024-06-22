import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(
    userId: string,
    userName: string,
    socketId: string,
  ): Promise<User> {
    const existingUser = await this.userModel.findOne({ userId });
    if (existingUser) {
      existingUser.socketId = socketId;
      existingUser.isActive = true;
      return existingUser.save();
    }
    const newUser = new this.userModel({
      userId,
      userName,
      socketId,
      isActive: true,
    });
    return newUser.save();
  }

  async removeUser(socketId: string): Promise<User> {
    return this.userModel.findOneAndUpdate({ socketId }, { isActive: false });
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserById(userId: string): Promise<User> {
    return this.userModel.findOne({ userId }).exec();
  }

  async getActiveUsers(excludeUserId: string): Promise<User[]> {
    return this.userModel
      .find({ isActive: true, userId: { $ne: excludeUserId } })
      .exec();
  }
}
