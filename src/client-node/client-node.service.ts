import { Injectable } from '@nestjs/common'
import {
  BroadcastMessage,
  ProposeMessage,
  IRpcClient
} from './interface/client-node.interface'
import { take } from 'rxjs/internal/operators/take'
import { Cron } from '@nestjs/schedule'
import { appendFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

export interface IRoundData {
  selfDecision: BroadcastMessage
  otherClientsDecisions: BroadcastMessage[]
}

@Injectable()
export class ClientNodeService {
  private outFileLocation = '../../output'

  public nodeIds = [0, 1, 2, 3, 4, 5, 6]

  private rpcClients: IRpcClient[] = []

  private currentProposerId = 0

  private roundNumber = 0

  private numberOfTraitors = 0

  private inactiveNodes: number[] = []

  private currentRoundData: Array<IRoundData> = new Array<IRoundData>(7)

  constructor() {}

  @Cron('0 * * * *')
  randomNoAction() {
    if (this.roundNumber >= 20) {
      return
    }
    const randomNode1 = this.randomId
    let randomNode2 = this.randomId
    while (randomNode2 === randomNode1) {
      randomNode2 = this.randomId
    }
    this.inactiveNodes = [randomNode1, randomNode2]

    console.log(this.inactiveNodes)
  }

  @Cron('*/15 * * * * *')
  async scheduler() {
    if (this.roundNumber >= 20) {
      return process.exit(0)
    }
    this.roundNumber++
    this.initRoundData()

    await this.propose()
    setTimeout(() => {
      this.traitorPropose()
    }, 500)
    setTimeout(() => this.onRoundFinish(), 7000)
  }

  public setClients(clients: IRpcClient[], nTraitors = 2) {
    this.numberOfTraitors = nTraitors
    this.rpcClients = clients
    for (let i = 0; i < nTraitors; i++) {
      const traitorId = 6 - i
      this.rpcClients[traitorId].isTraitor = true
      console.log(`${traitorId} is the traitor`)
    }
  }

  private initRoundData() {
    for (let i = 0; i < 7; i++)
      this.currentRoundData[i] = {
        otherClientsDecisions: [],
        selfDecision: null
      }
  }

  public async propose(proposerId?: number) {
    // const proposer = this.rpcClients[this.currentProposerId]
    // const { nodeId, service, isTraitor } = proposer

    // the proposer propose message to other nodes
    return await Promise.all(
      this.nodeIds.map(async (nodeId) => {
        if (
          nodeId !== this.currentProposerId &&
          !this.inactiveNodes.includes[nodeId]
        ) {
          return await this.rpcClients[nodeId].service
            .rpcPropose({
              id: proposerId || this.currentProposerId,
              clientId: nodeId
            })
            .toPromise()
        }
      })
    )
  }

  private traitorPropose() {
    if (this.randomAnswer === 'true') {
      const traitors = this.rpcClients.filter((client) => client.isTraitor)
      if (!traitors.length) return
      let index = 0

      const propose = async (traitor: IRpcClient) => {
        const isPropose = this.randomAnswer === 'true'
        if (
          traitor.nodeId !== this.currentProposerId && // if it is not the current proposer
          !this.inactiveNodes.includes(traitor.nodeId) && // and not in the "inactive list"
          isPropose // "and the arbitrary behavior is to propose"
        ) {
          await this.propose(traitor.nodeId)
        }

        setTimeout(() => {
          index += 1
          if (index >= traitors.length) return
          return propose(traitors[index])
        }, 500)
      }
      propose(traitors[0])
    }
  }

  async processBroadcastMessage(data: BroadcastMessage) {
    const {
      info: { clientId }
    } = data
    this.currentRoundData[clientId].otherClientsDecisions.push(data)
  }

  // receive propose => broadcast the decisions for other nodes (exclude the proposer and the current node)
  public onReceivePropose(data: ProposeMessage) {
    const { id, clientId } = data
    const result = this.decide(id, clientId)

    const selfMessage: BroadcastMessage = {
      reply: result,
      info: {
        id,
        clientId // self id
      }
    }
    this.currentRoundData[clientId].selfDecision = selfMessage

    if (this.inactiveNodes.includes(clientId)) {
      // is the node is "inactive" node
      // => receive propose then go silent
      return
    }

    const toBroadcastGroup = this.nodeIds.filter(
      (node) => node !== id && node !== clientId
    )
    toBroadcastGroup.forEach((nodeId) => {
      this.rpcClients[nodeId].service
        .rpcBroadcastReply({
          reply: result,
          info: { id: clientId, clientId: nodeId }
        })
        .pipe(take(1))
        .subscribe()
    })
  }

  private decide(id: number, clientId: number): 'true' | 'false' {
    const client = this.rpcClients[clientId]
    // if the proposer is not in the right turns and is not a traitor, give false reply
    if (id !== this.currentProposerId && !client.isTraitor) return 'false'
    // if node is a traitor, random the answer

    if (client.isTraitor) {
      // if the client is a traitor, it might gives a false answer
      const probability = Math.floor(Math.random() * 100) + 1
      if (probability < 50) return 'false'
    }
    return 'true'
  }

  private async onRoundFinish() {
    //when the round is finished (7 seconds after receive propose)
    // => Calculate the result for each node and write to the file
    await Promise.all(
      this.currentRoundData.map(async (dataId) => {
        if (!dataId.selfDecision) return
        const totalTrueReply = dataId.otherClientsDecisions.filter(
          (k) => k.reply === 'true'
        )

        const finalReply =
          totalTrueReply.length + (dataId.selfDecision.reply === 'true' ? 1 : 0)

        if (finalReply >= 4) {
          const { id, clientId } = dataId.selfDecision.info
          // iif node receive 4 or more "true" reply => save record
          await this.createDoc(id, clientId)
        }
      })
    )

    // start a new round
    this.currentRoundData = []
    this.currentProposerId++
    if (this.currentProposerId > 6) this.currentProposerId = 0
  }

  private async createDoc(proposerId: number, selfId: number) {
    const outputText = `\n=====================================================
    Time: ${new Date().toString()}
    proposerId: ${proposerId}
    message: ${proposerId}`
    const path = join(
      __dirname,
      `${this.outFileLocation}/traitors-${this.numberOfTraitors}`
    )
    if (!existsSync(path)) {
      await mkdirSync(path)
    }
    await appendFileSync(join(`${path}/result${selfId}.txt`), outputText, {
      encoding: 'utf-8'
    })
  }

  private get randomAnswer() {
    const prob = Math.floor(Math.random() * 100) + 1
    if (prob < 50) return 'false'
    else return 'true'
  }

  private get randomId() /* 0-6 */ {
    return Math.floor(Math.random() * 7)
  }
}
