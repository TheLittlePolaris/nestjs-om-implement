import { Observable } from 'rxjs'
import { info } from 'console'

export interface ProposeMessage {
  id: number
  clientId: number // the target of the call
}

export interface BroadcastMessage {
  reply: string // the message "true" or "false"
  info: ProposeMessage
}

export interface IRpcClientService {
  rpcPropose(data: ProposeMessage): Observable<BroadcastMessage>
  rpcBroadcastReply(data: BroadcastMessage): Observable<BroadcastMessage>
}

export interface IRpcClient {
  nodeId: number
  isTraitor: boolean
  service: IRpcClientService
}
