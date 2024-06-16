import { ChatGateway } from './chat/chat.gateway';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly chatGateway: ChatGateway) {}

  @Get('users')
  getUsers() {
    return this.chatGateway.users.map((user) => user.userId);
  }
}
