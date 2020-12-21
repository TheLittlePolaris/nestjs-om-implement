import { OnModuleInit } from '@nestjs/common';
import { ClientNodeService } from './client-node.service';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { ProposeMessage, BroadcastMessage } from './interface/client-node.interface';
import { Metadata, ServerUnaryCall } from 'grpc';
export declare class ClientNodeController implements OnModuleInit {
    private readonly client0;
    private readonly client1;
    private readonly client2;
    private readonly client3;
    private readonly client4;
    private readonly client5;
    private readonly client6;
    private clientNodeService;
    nodeIds: number[];
    constructor(client0: ClientGrpcProxy, client1: ClientGrpcProxy, client2: ClientGrpcProxy, client3: ClientGrpcProxy, client4: ClientGrpcProxy, client5: ClientGrpcProxy, client6: ClientGrpcProxy, clientNodeService: ClientNodeService);
    onModuleInit(): void;
    rpcBroadcastReply(data: BroadcastMessage, metadata: Metadata, call: ServerUnaryCall<any>): BroadcastMessage;
    rpcPropose(data: ProposeMessage, metadata: Metadata, call: ServerUnaryCall<any>): Promise<ProposeMessage>;
}
