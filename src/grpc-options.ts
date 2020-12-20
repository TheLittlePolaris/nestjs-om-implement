import { ClientOptions, Transport, GrpcOptions } from '@nestjs/microservices'
import { join } from 'path'

export const grpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    url: `localhost:${process.env.PORT || 5000}`,
    package: 'client_node',
    protoPath: join(__dirname, './proto/client-node.proto')
  }
}
