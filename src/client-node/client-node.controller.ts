import { Controller, Get, Param, Inject, OnModuleInit } from '@nestjs/common';
import { ClientNodeService } from './client-node.service';
import { GrpcMethod, ClientGrpcProxy } from '@nestjs/microservices';
import { NodeId, Node } from './interface/client-node.interface';
import { Observable } from 'rxjs';
interface RpcClientService {
  rpcGetById(data: NodeId): Observable<Node>;
  rpcBroadcast(data: Node): Observable<Node>;
}

@Controller('client-node')
export class ClientNodeController implements OnModuleInit {
  public nodeIds = [0, 1, 2, 3, 4, 5, 6]; // 7 nodes in the network

  private rpcClientService: RpcClientService[] = [];

  constructor(
    @Inject('client_node0') private readonly client0: ClientGrpcProxy,
    @Inject('client_node1') private readonly client1: ClientGrpcProxy,
    @Inject('client_node2') private readonly client2: ClientGrpcProxy,
    @Inject('client_node3') private readonly client3: ClientGrpcProxy,
    @Inject('client_node4') private readonly client4: ClientGrpcProxy,
    @Inject('client_node5') private readonly client5: ClientGrpcProxy,
    @Inject('client_node6') private readonly client6: ClientGrpcProxy,
    private clientNodeService: ClientNodeService
  ) {
    // console.log(client);
  }

  onModuleInit() {
    [0, 1, 2, 3, 4, 5, 6].map((i) => {
      this.rpcClientService[i] = this[
        `client${i}`
      ].getService<RpcClientService>('RpcNodeService');
    });
    [0, 1, 2, 3, 4, 5, 6].map((i) => {
      console.log(this.rpcClientService[i]);
    });
  }

  @Get()
  async getAll() {
    return await this.clientNodeService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return await this.clientNodeService.getById(id);
  }

  @GrpcMethod('ClientNodeService', 'rpcBroadcastReply')
  rpcGetAll(data: Node) {
    console.log(data, '<===== DATA FROM RPC CLIENT');
    return data;
  }

  @GrpcMethod('ClientNodeService', 'rpcPropose')
  async rpcGetById(data: NodeId) {
    console.log('CALL GET BY ID, ID ==== ', data.id);
    return this.clientNodeService.getById(data.id);
  }
}
