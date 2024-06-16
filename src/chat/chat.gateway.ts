import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface User {
  userId: string;
  socketId: string;
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  public users: User[] = [];

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.users.push({ userId, socketId: client.id });
      this.emitUsers();
    }
  }

  handleDisconnect(client: Socket) {
    this.users = this.users.filter((user) => user.socketId !== client.id);
    this.emitUsers();
  }

  emitUsers() {
    this.server.emit(
      'users',
      this.users.map((user) => user.userId),
    );
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(
    client: Socket,
    payload: { recipientId: string; senderId: string; message: string },
  ): void {
    const recipient = this.users.find(
      (user) => user.userId === payload.recipientId,
    );
    if (recipient) {
      this.server.to(recipient.socketId).emit('privateMessage', {
        senderId: payload.senderId,
        message: payload.message,
      });
    }
  }
}
