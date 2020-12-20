import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ClientNodeModule } from './client-node/client-node.module'

@Module({
  imports: [ClientNodeModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
