import { Controller, Get, Param, Inject, OnModuleInit } from '@nestjs/common'
import { ClientNodeService } from './client-node.service'
import { GrpcMethod, ClientGrpcProxy, ClientGrpc } from '@nestjs/microservices'
import {
  ProposeMessage,
  BroadcastMessage,
  IRpcClient,
  IRpcClientService
} from './interface/client-node.interface'
import { Metadata, ServerUnaryCall } from 'grpc'
import { take } from 'rxjs/operators'

@Controller('client-node')
export class ClientNodeController implements OnModuleInit {
  // 7 nodes in the network
  public nodeIds = [0, 1, 2, 3, 4, 5, 6]

  constructor(
    @Inject('client_node0') private readonly client0: ClientGrpcProxy,
    @Inject('client_node1') private readonly client1: ClientGrpcProxy,
    @Inject('client_node2') private readonly client2: ClientGrpcProxy,
    @Inject('client_node3') private readonly client3: ClientGrpcProxy,
    @Inject('client_node4') private readonly client4: ClientGrpcProxy,
    @Inject('client_node5') private readonly client5: ClientGrpcProxy,
    @Inject('client_node6') private readonly client6: ClientGrpcProxy,
    private clientNodeService: ClientNodeService
  ) {}

  onModuleInit() {
    const clients = this.nodeIds.map((id) => ({
      nodeId: id,
      isTraitor: false,
      service: this[`client${id}`].getService<IRpcClientService>(
        'RpcNodeService'
      )
    }))

    this.clientNodeService.setClients(clients, 5) // set ntraitors here
  }

  @GrpcMethod('RpcNodeService', 'rpcBroadcastReply')
  rpcBroadcastReply(
    data: BroadcastMessage,
    metadata: Metadata,
    call: ServerUnaryCall<any>
  ) {
    //receive broadcastreply => save result

    this.clientNodeService.processBroadcastMessage(data)
    return data
  }

  @GrpcMethod('RpcNodeService', 'rpcPropose')
  async rpcPropose(
    data: ProposeMessage,
    metadata: Metadata,
    call: ServerUnaryCall<any>
  ) {
    this.clientNodeService.onReceivePropose(data)
    return data
  }
}
