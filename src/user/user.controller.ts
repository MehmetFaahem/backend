import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('active/:userId')
  async getActiveUsers(@Param('userId') userId: string) {
    return this.userService.getActiveUsers(userId);
  }
}
