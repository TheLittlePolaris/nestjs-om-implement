import { Module } from '@nestjs/common'
import { ClientNodeService } from './client-node.service'
import { ClientNodeController } from './client-node.controller'
import {
  ClientsModule,
  Transport,
  ClientsModuleOptions
} from '@nestjs/microservices'
import { join } from 'path'

export const clientOptions: ClientsModuleOptions = [
  {
    name: 'client_node0',
    transport: Transport.GRPC,
    options: {
      package: 'client_node',
      protoPath: join(__dirname, '../proto/client-node.proto'),
      url: `localhost:5000`
    }
  },
  {
    name: 'client_node1',
    transport: Transport.GRPC,
    options: {
      package: 'client_node',
      protoPath: join(__dirname, '../proto/client-node.proto'),
      url: `localhost:5001`
    }
  },
  {
    name: 'client_node2',
    transport: Transport.GRPC,
    options: {
      package: 'client_node',
      protoPath: join(__dirname, '../proto/client-node.proto'),
      url: `localhost:5002`
    }
  },
  {
    name: 'client_node3',
    transport: Transport.GRPC,
    options: {
      package: 'client_node',
      protoPath: join(__dirname, '../proto/client-node.proto'),
      url: `localhost:5003`
    }
  },
  {
    name: 'client_node4',
    transport: Transport.GRPC,
    options: {
      package: 'client_node',
      protoPath: join(__dirname, '../proto/client-node.proto'),
      url: `localhost:5004`
    }
  },
  {
    name: 'client_node5',
    transport: Transport.GRPC,
    options: {
      package: 'client_node',
      protoPath: join(__dirname, '../proto/client-node.proto'),
      url: `localhost:5005`
    }
  },
  {
    name: 'client_node6',
    transport: Transport.GRPC,
    options: {
      package: 'client_node',
      protoPath: join(__dirname, '../proto/client-node.proto'),
      url: `localhost:5006`
    }
  }
]

@Module({
  imports: [ClientsModule.register(clientOptions)],
  providers: [ClientNodeService],
  controllers: [ClientNodeController]
})
export class ClientNodeModule {}
