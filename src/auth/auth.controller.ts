import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: { userName: string; email: string; password: string },
  ) {
    try {
      await this.authService.register(
        registerDto.userName,
        registerDto.email,
        registerDto.password,
      );
      return { message: 'Registration successful' };
    } catch (error) {
      if (error instanceof ConflictException) {
        return { statusCode: HttpStatus.CONFLICT, message: error.message };
      }
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { email: string; password: string }) {
    const token = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    return { token };
  }
}
