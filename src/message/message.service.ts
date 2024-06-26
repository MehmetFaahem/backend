import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async saveMessage(
    senderId: string,
    senderName: string,
    recipientId: string,
    message: string,
    timestamp: Date,
  ): Promise<Message> {
    const newMessage = new this.messageModel({
      senderId,
      senderName,
      recipientId,
      message,
      timestamp,
    });
    return newMessage.save();
  }

  async getMessages(
    senderName: string,
    recipientId: string,
  ): Promise<Message[]> {
    console.log('Getting messages for:', { senderName, recipientId });
    const messages = await this.messageModel
      .find({
        $or: [
          { senderName, recipientId },
          { senderName: recipientId, recipientId: senderName },
        ],
      })
      .exec();
    console.log('Found messages:', messages);
    return messages;
  }
}
