import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class OrderGateway implements OnGatewayConnection {
    server: Server;
    handleConnection(client: Socket): void;
    sendUserUpdate(userId: string, order: any): void;
    sendAdminUpdate(order: any): void;
}
