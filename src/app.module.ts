import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ClientNodeModule } from './client-node/client-node.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    ClientNodeModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
