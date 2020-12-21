"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
        options: {
            url: `localhost:5000`,
            package: 'client_node',
            protoPath: path_1.join(__dirname, './client-node/client-node.proto')
        }
    });
    app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'client_node',
            protoPath: path_1.join(__dirname, './client-node/client-node.proto'),
            url: `localhost:5001`
        }
    });
    app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'client_node',
            protoPath: path_1.join(__dirname, './client-node/client-node.proto'),
            url: `localhost:5002`
        }
    });
    app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'client_node',
            protoPath: path_1.join(__dirname, './client-node/client-node.proto'),
            url: `localhost:5003`
        }
    });
    app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'client_node',
            protoPath: path_1.join(__dirname, './client-node/client-node.proto'),
            url: `localhost:5004`
        }
    });
    app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'client_node',
            protoPath: path_1.join(__dirname, './client-node/client-node.proto'),
            url: `localhost:5005`
        }
    });
    app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'client_node',
            protoPath: path_1.join(__dirname, './client-node/client-node.proto'),
            url: `localhost:5006`
        }
    });
    await app.startAllMicroservicesAsync();
    await app.listen(process.env.PORT || 3000);
    console.log(`Node listening on ${await app.getUrl()}`);
    process.on('exit', (code) => {
        console.log('Process exited with code: ' + code);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map