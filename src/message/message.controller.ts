import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from '../schemas/message.schema';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async saveMessage(
    @Body()
    createMessageDto: {
      senderId: string;
      senderName: string;
      recipientId: string;
      message: string;
      timestamp: Date;
    },
  ): Promise<Message> {
    return this.messageService.saveMessage(
      createMessageDto.senderId,
      createMessageDto.senderName,
      createMessageDto.recipientId,
      createMessageDto.message,
      createMessageDto.timestamp,
    );
  }

  @Get(':senderId/:recipientId')
  async getMessages(
    @Param('senderId') senderId: string,
    @Param('recipientId') recipientId: string,
  ): Promise<Message[]> {
    return this.messageService.getMessages(senderId, recipientId);
  }
}
