import { Observable } from 'rxjs';
export interface ProposeMessage {
    id: number;
    clientId: number;
}
export interface BroadcastMessage {
    reply: string;
    info: ProposeMessage;
}
export interface IRpcClientService {
    rpcPropose(data: ProposeMessage): Observable<BroadcastMessage>;
    rpcBroadcastReply(data: BroadcastMessage): Observable<BroadcastMessage>;
}
export interface IRpcClient {
    nodeId: number;
    isTraitor: boolean;
    service: IRpcClientService;
}
