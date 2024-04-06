// 导入 NestJS 框架中的相关模块和装饰器
import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

// 导入 Socket.IO 中的 Server 类
import { Server } from 'socket.io';

// WebSocket 网关装饰器，用于标记这是一个 WebSocket 网关类
@WebSocketGateway({
    cors: {
      // 这是我们的React App 运行的地址
      origin: ['http://localhost:3000'],
    },
})
export class MyGateway implements OnModuleInit {

    // WebSocketServer 装饰器，用于指定 WebSocket 服务器实例
    @WebSocketServer()
    server: Server;

    // 在模块初始化时执行的方法
    onModuleInit() {
        // 监听连接事件
        this.server.on('connection', (socket) => {
            // 打印连接的 socket id
            console.log(socket.id);
            // 打印连接成功信息
            console.log('Connected');
        }); 
    }

    // 监听客户端发送的 'newMessage' 消息
    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any) {
        // 打印接收到的消息体
        console.log(body);
        // 向所有客户端发送 'onMessage' 消息
        this.server.emit('onMessage', {
            msg: 'New Message',
            content: body,
        }); 
    }
}
