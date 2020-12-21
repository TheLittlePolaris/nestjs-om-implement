"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientNodeModule = exports.clientOptions = void 0;
const common_1 = require("@nestjs/common");
const client_node_service_1 = require("./client-node.service");
const client_node_controller_1 = require("./client-node.controller");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
exports.clientOptions = [
    {
        name: 'client_node0',
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'client_node',
            protoPath: path_1.join(__dirname, './client-node.proto'),
            url: `localhost:5000`
        }
    },
    {
        name: 'client_node1',
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'client_node',
            protoPath: path_1.join(__dirname, './client-node.proto'),
            url: `localhost:5001`
        }
    },
    {
        name: 'client_node2',
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'client_node',
            protoPath: path_1.join(__dirname, './client-node.proto'),
            url: `localhost:5002`
        }
    },
    {
        name: 'client_node3',
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'client_node',
            protoPath: path_1.join(__dirname, './client-node.proto'),
            url: `localhost:5003`
        }
    },
    {
        name: 'client_node4',
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'client_node',
            protoPath: path_1.join(__dirname, './client-node.proto'),
            url: `localhost:5004`
        }
    },
    {
        name: 'client_node5',
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'client_node',
            protoPath: path_1.join(__dirname, './client-node.proto'),
            url: `localhost:5005`
        }
    },
    {
        name: 'client_node6',
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'client_node',
            protoPath: path_1.join(__dirname, './client-node.proto'),
            url: `localhost:5006`
        }
    }
];
let ClientNodeModule = class ClientNodeModule {
};
ClientNodeModule = __decorate([
    common_1.Module({
        imports: [microservices_1.ClientsModule.register(exports.clientOptions)],
        providers: [client_node_service_1.ClientNodeService],
        controllers: [client_node_controller_1.ClientNodeController]
    })
], ClientNodeModule);
exports.ClientNodeModule = ClientNodeModule;
//# sourceMappingURL=client-node.module.js.map