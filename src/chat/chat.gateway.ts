import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
  ) {}

  async handleConnection(client: Socket) {
    const userId = Array.isArray(client.handshake.query.userId)
      ? client.handshake.query.userId[0]
      : client.handshake.query.userId;
    const userName = Array.isArray(client.handshake.query.userName)
      ? client.handshake.query.userName[0]
      : client.handshake.query.userName;

    if (userId && userName) {
      try {
        await this.userService.createUser(userId, userName, client.id);
        const users = await this.userService.getAllUsers();
        this.server.emit('users', users); // Emit users event
      } catch (error) {
        console.error(`Failed to create user: ${error.message}`);
        // Handle error, e.g., send an error message to the client
      }
    }
  }

  async handleDisconnect(client: Socket) {
    // await this.userService.removeUser(client.id);
    const users = await this.userService.getAllUsers();
    this.server.emit('users', users); // Emit users event
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
