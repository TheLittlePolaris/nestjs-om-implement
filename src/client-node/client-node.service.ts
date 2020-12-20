import { Injectable } from '@nestjs/common'
import {
  BroadcastMessage,
  ProposeMessage,
  IRpcClient
} from './interface/client-node.interface'
import { take } from 'rxjs/internal/operators/take'
import { Cron } from '@nestjs/schedule'

export interface IRoundData {
  selfDecision: BroadcastMessage
  otherClientsDecisions: BroadcastMessage[]
}

@Injectable()
export class ClientNodeService {
  private outFileLocation = '../../output'

  // private nodeIds: number[] = []
  public nodeIds = [0, 1, 2, 3, 4, 5, 6]

  private rpcClients: IRpcClient[] = []

  private currentProposerId = 0

  private currentRoundData: Array<IRoundData> = new Array<IRoundData>(7)

  constructor() {}

  @Cron('*/15 * * * * *')
  scheduler() {
    console.log('Scheduler')
    this.propose()
  }

  public setClients(clients: IRpcClient[]) {
    this.rpcClients = clients
  }

  public propose() {
    // const proposer = this.rpcClients[this.currentProposerId]
    // const { nodeId, service, isTraitor } = proposer
    this.nodeIds.forEach((node) => {
      if (node !== this.currentProposerId)
        this.rpcClients[node].service
          .rpcPropose({ id: this.currentProposerId, clientId: node })
          .pipe(take(1))
          .subscribe()
    })
  }

  async processBroadcastMessage(data: BroadcastMessage) {
    const {
      info: { clientId }
    } = data
    this.currentRoundData[clientId].otherClientsDecisions.push(data)

    // const outfile = join(__dirname, `${this.outFileLocation}${clientId}`)
  }

  public onReceivePropose(data: ProposeMessage) {
    const { id, clientId } = data
    const result = this.decide(id, clientId)

    const toBroadcastGroup = this.nodeIds.filter(
      (node) => node !== id && node !== clientId
    )

    const decision = this.decide(id, clientId)

    toBroadcastGroup.map((nodeId) => {
      this.rpcClients[nodeId].service
        .rpcBroadcastReply({
          reply: decision,
          info: { id: clientId, clientId: nodeId }
        })
        .pipe(take(1))
        .subscribe()
    })

    const selfMessage: BroadcastMessage = {
      reply: result,
      info: {
        id,
        clientId
      }
    }
    this.currentRoundData[clientId].selfDecision = selfMessage
  }

  private decide(id: number, clientId: number): 'true' | 'false' {
    //implement arbitrary behavior
    return 'true'
  }

  private onRoundFinish() {
    // wait for 7 seconds then => timeout, calculate result
  }
}
