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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientNodeController = void 0;
const common_1 = require("@nestjs/common");
const client_node_service_1 = require("./client-node.service");
const microservices_1 = require("@nestjs/microservices");
const grpc_1 = require("grpc");
let ClientNodeController = class ClientNodeController {
    constructor(client0, client1, client2, client3, client4, client5, client6, clientNodeService) {
        this.client0 = client0;
        this.client1 = client1;
        this.client2 = client2;
        this.client3 = client3;
        this.client4 = client4;
        this.client5 = client5;
        this.client6 = client6;
        this.clientNodeService = clientNodeService;
        this.nodeIds = [0, 1, 2, 3, 4, 5, 6];
    }
    onModuleInit() {
        const clients = this.nodeIds.map((id) => ({
            nodeId: id,
            isTraitor: false,
            service: this[`client${id}`].getService('RpcNodeService')
        }));
        this.clientNodeService.setClients(clients, 5);
    }
    rpcBroadcastReply(data, metadata, call) {
        this.clientNodeService.processBroadcastMessage(data);
        return data;
    }
    async rpcPropose(data, metadata, call) {
        this.clientNodeService.onReceivePropose(data);
        return data;
    }
};
__decorate([
    microservices_1.GrpcMethod('RpcNodeService', 'rpcBroadcastReply'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, grpc_1.Metadata,
        grpc_1.ServerUnaryCall]),
    __metadata("design:returntype", void 0)
], ClientNodeController.prototype, "rpcBroadcastReply", null);
__decorate([
    microservices_1.GrpcMethod('RpcNodeService', 'rpcPropose'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, grpc_1.Metadata,
        grpc_1.ServerUnaryCall]),
    __metadata("design:returntype", Promise)
], ClientNodeController.prototype, "rpcPropose", null);
ClientNodeController = __decorate([
    common_1.Controller('client-node'),
    __param(0, common_1.Inject('client_node0')),
    __param(1, common_1.Inject('client_node1')),
    __param(2, common_1.Inject('client_node2')),
    __param(3, common_1.Inject('client_node3')),
    __param(4, common_1.Inject('client_node4')),
    __param(5, common_1.Inject('client_node5')),
    __param(6, common_1.Inject('client_node6')),
    __metadata("design:paramtypes", [microservices_1.ClientGrpcProxy,
        microservices_1.ClientGrpcProxy,
        microservices_1.ClientGrpcProxy,
        microservices_1.ClientGrpcProxy,
        microservices_1.ClientGrpcProxy,
        microservices_1.ClientGrpcProxy,
        microservices_1.ClientGrpcProxy,
        client_node_service_1.ClientNodeService])
], ClientNodeController);
exports.ClientNodeController = ClientNodeController;
//# sourceMappingURL=client-node.controller.js.map