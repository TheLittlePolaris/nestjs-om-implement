import { BroadcastMessage, ProposeMessage, IRpcClient } from './interface/client-node.interface';
export interface IRoundData {
    selfDecision: BroadcastMessage;
    otherClientsDecisions: BroadcastMessage[];
}
export declare class ClientNodeService {
    private outFileLocation;
    nodeIds: number[];
    private rpcClients;
    private currentProposerId;
    private roundNumber;
    private numberOfTraitors;
    private inactiveNodes;
    private currentRoundData;
    constructor();
    randomNoAction(): void;
    scheduler(): Promise<never>;
    setClients(clients: IRpcClient[], nTraitors?: number): void;
    private initRoundData;
    propose(proposerId?: number): Promise<BroadcastMessage[]>;
    private traitorPropose;
    processBroadcastMessage(data: BroadcastMessage): Promise<void>;
    onReceivePropose(data: ProposeMessage): void;
    private decide;
    private onRoundFinish;
    private createDoc;
    private get randomAnswer();
    private get randomId();
}
