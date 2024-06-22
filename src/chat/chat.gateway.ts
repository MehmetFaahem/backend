import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { MessageService } from 'src/message/message.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket', 'polling'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.query.token as string;
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.getUserById(decoded.userId);
      if (user) {
        user.socketId = client.id;
        await user.save();
        const users = await this.userService.getAllUsers();
        this.server.emit('users', users);
      } else {
        client.disconnect();
      }
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    // const user = await this.userService.removeUser(client.id);
    // if (user) {
    //   const users = await this.userService.getAllUsers();
    //   this.server.emit('users', users);
    // }
  }

  @SubscribeMessage('privateMessage')
  async handlePrivateMessage(
    client: Socket,
    payload: {
      senderId: string;
      senderName: string;
      recipientId: string;
      message: string;
      timestamp: Date;
    },
  ) {
    await this.messageService.saveMessage(
      payload.senderId,
      payload.senderName,
      payload.recipientId,
      payload.message,
      payload.timestamp,
    );
    const recipient = await this.userService.getUserById(payload.recipientId);
    if (recipient) {
      this.server.to(recipient.socketId).emit('privateMessage', payload);
    }
  }
}
