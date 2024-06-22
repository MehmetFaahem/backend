import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    JwtModule.register({
      secret: 'CHATAPP',
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Ensure User schema is imported here
    UserModule, // Ensure UserModule is imported here
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
