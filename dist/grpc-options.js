"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grpcClientOptions = void 0;
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
exports.grpcClientOptions = {
    transport: microservices_1.Transport.GRPC,
    options: {
        url: `localhost:${process.env.PORT || 5000}`,
        package: 'client_node',
        protoPath: path_1.join(__dirname, './proto/client-node.proto')
    }
};
//# sourceMappingURL=grpc-options.js.map