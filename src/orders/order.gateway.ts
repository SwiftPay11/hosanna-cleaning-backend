import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class OrderGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (userId) {
      client.join(userId);
      console.log("User joined room:", userId);
    }
  }

  sendUserUpdate(userId: string, order: any) {
  this.server.to(userId).emit("orderUpdated", order);
}

sendAdminUpdate(order: any) {
  this.server.emit("adminOrderUpdated", order);
}

}
