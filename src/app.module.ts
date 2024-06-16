import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://mehmetfaahem:k8chDtxqqWU5noNu@chatapp.spqtdeg.mongodb.net/?retryWrites=true&w=majority&appName=chatapp',
    ),
    UserModule,
    MessageModule,
  ],
  providers: [ChatGateway],
})
export class AppModule {}
