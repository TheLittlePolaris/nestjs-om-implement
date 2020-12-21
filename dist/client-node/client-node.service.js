"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientNodeService = void 0;
const common_1 = require("@nestjs/common");
const take_1 = require("rxjs/internal/operators/take");
const schedule_1 = require("@nestjs/schedule");
const fs_1 = require("fs");
const path_1 = require("path");
let ClientNodeService = class ClientNodeService {
    constructor() {
        this.outFileLocation = '../../output';
        this.nodeIds = [0, 1, 2, 3, 4, 5, 6];
        this.rpcClients = [];
        this.currentProposerId = 0;
        this.roundNumber = 0;
        this.numberOfTraitors = 0;
        this.inactiveNodes = [];
        this.currentRoundData = new Array(7);
    }
    randomNoAction() {
        if (this.roundNumber >= 20) {
            return;
        }
        const randomNode1 = this.randomId;
        let randomNode2 = this.randomId;
        while (randomNode2 === randomNode1) {
            randomNode2 = this.randomId;
        }
        this.inactiveNodes = [randomNode1, randomNode2];
        console.log(this.inactiveNodes);
    }
    async scheduler() {
        if (this.roundNumber >= 20) {
            return process.exit(0);
        }
        this.roundNumber++;
        this.initRoundData();
        await this.propose();
        setTimeout(() => {
            this.traitorPropose();
        }, 500);
        setTimeout(() => this.onRoundFinish(), 7000);
    }
    setClients(clients, nTraitors = 2) {
        this.numberOfTraitors = nTraitors;
        this.rpcClients = clients;
        for (let i = 0; i < nTraitors; i++) {
            const traitorId = 6 - i;
            this.rpcClients[traitorId].isTraitor = true;
            console.log(`${traitorId} is the traitor`);
        }
    }
    initRoundData() {
        for (let i = 0; i < 7; i++)
            this.currentRoundData[i] = {
                otherClientsDecisions: [],
                selfDecision: null
            };
    }
    async propose(proposerId) {
        return await Promise.all(this.nodeIds.map(async (nodeId) => {
            if (nodeId !== this.currentProposerId &&
                !this.inactiveNodes.includes[nodeId]) {
                return await this.rpcClients[nodeId].service
                    .rpcPropose({
                    id: proposerId || this.currentProposerId,
                    clientId: nodeId
                })
                    .toPromise();
            }
        }));
    }
    traitorPropose() {
        if (this.randomAnswer === 'true') {
            const traitors = this.rpcClients.filter((client) => client.isTraitor);
            if (!traitors.length)
                return;
            let index = 0;
            const propose = async (traitor) => {
                const isPropose = this.randomAnswer === 'true';
                if (traitor.nodeId !== this.currentProposerId &&
                    !this.inactiveNodes.includes(traitor.nodeId) &&
                    isPropose) {
                    await this.propose(traitor.nodeId);
                }
                setTimeout(() => {
                    index += 1;
                    if (index >= traitors.length)
                        return;
                    return propose(traitors[index]);
                }, 500);
            };
            propose(traitors[0]);
        }
    }
    async processBroadcastMessage(data) {
        const { info: { clientId } } = data;
        this.currentRoundData[clientId].otherClientsDecisions.push(data);
    }
    onReceivePropose(data) {
        const { id, clientId } = data;
        const result = this.decide(id, clientId);
        const selfMessage = {
            reply: result,
            info: {
                id,
                clientId
            }
        };
        this.currentRoundData[clientId].selfDecision = selfMessage;
        if (this.inactiveNodes.includes(clientId)) {
            return;
        }
        const toBroadcastGroup = this.nodeIds.filter((node) => node !== id && node !== clientId);
        toBroadcastGroup.forEach((nodeId) => {
            this.rpcClients[nodeId].service
                .rpcBroadcastReply({
                reply: result,
                info: { id: clientId, clientId: nodeId }
            })
                .pipe(take_1.take(1))
                .subscribe();
        });
    }
    decide(id, clientId) {
        const client = this.rpcClients[clientId];
        if (id !== this.currentProposerId && !client.isTraitor)
            return 'false';
        if (client.isTraitor) {
            const probability = Math.floor(Math.random() * 100) + 1;
            if (probability < 50)
                return 'false';
        }
        return 'true';
    }
    async onRoundFinish() {
        await Promise.all(this.currentRoundData.map(async (dataId) => {
            if (!dataId.selfDecision)
                return;
            const totalTrueReply = dataId.otherClientsDecisions.filter((k) => k.reply === 'true');
            const finalReply = totalTrueReply.length + (dataId.selfDecision.reply === 'true' ? 1 : 0);
            if (finalReply >= 4) {
                const { id, clientId } = dataId.selfDecision.info;
                await this.createDoc(id, clientId);
            }
        }));
        this.currentRoundData = [];
        this.currentProposerId++;
        if (this.currentProposerId > 6)
            this.currentProposerId = 0;
    }
    async createDoc(proposerId, selfId) {
        const outputText = `\n=====================================================
    Time: ${new Date().toString()}
    proposerId: ${proposerId}
    message: ${proposerId}`;
        const path = path_1.join(__dirname, `${this.outFileLocation}/traitors-${this.numberOfTraitors}`);
        if (!fs_1.existsSync(path)) {
            await fs_1.mkdirSync(path);
        }
        await fs_1.appendFileSync(path_1.join(`${path}/result${selfId}.txt`), outputText, {
            encoding: 'utf-8'
        });
    }
    get randomAnswer() {
        const prob = Math.floor(Math.random() * 100) + 1;
        if (prob < 50)
            return 'false';
        else
            return 'true';
    }
    get randomId() {
        return Math.floor(Math.random() * 7);
    }
};
__decorate([
    schedule_1.Cron('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClientNodeService.prototype, "randomNoAction", null);
__decorate([
    schedule_1.Cron('*/15 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientNodeService.prototype, "scheduler", null);
ClientNodeService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], ClientNodeService);
exports.ClientNodeService = ClientNodeService;
//# sourceMappingURL=client-node.service.js.map