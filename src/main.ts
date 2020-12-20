import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { join } from 'path'

// $env:PORT=5002; & yarn run start:dev
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  //client 0
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `localhost:5000`,
      package: 'client_node',
      protoPath: join(__dirname, './proto/client-node.proto')
    }
  })

  //client 1
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'client_node',
      protoPath: join(__dirname, './proto/client-node.proto'),
      url: `localhost:5001`
    }
  })

  //client 2
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'client_node',
      protoPath: join(__dirname, './proto/client-node.proto'),
      url: `localhost:5002`
    }
  })

  //client 3
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'client_node',
      protoPath: join(__dirname, './proto/client-node.proto'),
      url: `localhost:5003`
    }
  })

  //client 4
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'client_node',
      protoPath: join(__dirname, './proto/client-node.proto'),
      url: `localhost:5004`
    }
  })

  // client 5
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'client_node',
      protoPath: join(__dirname, './proto/client-node.proto'),
      url: `localhost:5005`
    }
  })

  //client 6
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'client_node',
      protoPath: join(__dirname, './proto/client-node.proto'),
      url: `localhost:5006`
    }
  })

  await app.startAllMicroservicesAsync()
  await app.listen(process.env.PORT || 3000)

  console.log(`Node listening on ${await app.getUrl()}`)
}
bootstrap()
