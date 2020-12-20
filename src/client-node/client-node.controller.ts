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

  // private currentProposerId: number = 0 // 0->6

  // private rpcClients: IRpcClient[] = []

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
    const clients = this.nodeIds.map((id) => ({
      nodeId: id,
      isTraitor: false,
      service: this[`client${id}`].getService<IRpcClientService>(
        'RpcNodeService'
      )
    }))

    this.clientNodeService.setClients(clients)
    this.clientNodeService.propose()
    // setTimeout(() => {
    //   this.nodeIds.forEach((node) => {
    //     if (node !== this.currentProposerId)
    //       this.rpcClients[node].service
    //         .rpcPropose({ id: this.currentProposerId, clientId: node })
    //         .subscribe()
    //   })
    // }, 1500)
  }

  @GrpcMethod('RpcNodeService', 'rpcBroadcastReply')
  rpcBroadcastReply(
    data: BroadcastMessage,
    metadata: Metadata,
    call: ServerUnaryCall<any>
  ) {
    //receive broadcastreply => save result
    console.log(data, '<===== Data received')
    this.clientNodeService.processBroadcastMessage(data)
    return data
  }

  @GrpcMethod('RpcNodeService', 'rpcPropose')
  async rpcPropose(
    data: ProposeMessage,
    metadata: Metadata,
    call: ServerUnaryCall<any>
  ) {
    console.log(data, '<====== data')
    this.clientNodeService.onReceivePropose(data)
    // receive propose => broadcast reply
    // const { id, clientId } = data
    // const toBroadcastGroup = this.nodeIds.filter(
    //   (node) => node !== id && node !== clientId
    // )
    // // console.log(toBroadcastGroup)
    // toBroadcastGroup.map((nodeId) => {
    //   this.rpcClients[nodeId].service
    //     .rpcBroadcastReply({
    //       reply: 'true',
    //       info: { id: clientId, clientId: nodeId }
    //     })
    //     .pipe(take(1))
    //     .subscribe()
    // })
    return data
  }
}
