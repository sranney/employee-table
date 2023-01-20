import {Server} from '@hapi/hapi';
import {green} from 'chalk';
import routes from './routes';
import inert from '@hapi/inert';

const server = new Server({
    port: 3000,
    routes: {
        cors: true
    }
});

server.register(inert).then(() => {
    server.route(routes);
    return server.start();
}).then(() => {
    console.log(green(`Server running at: ${server.info.uri}`));
}).catch(err => {
    console.error(err.stack);
});
