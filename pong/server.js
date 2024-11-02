import { WebSocketServer } from 'ws';

const verbose = !!process.env.WS_VERBOSE;
const port = process.env.WS_PORT ? Number(process.env.WS_PORT) : 1234;
const wss = new WebSocketServer({ port, host: '127.0.0.1' });

const timeoutMs = 60_000;
let connId = 1;

const interval = 200;

wss.on('connection', function connection(ws, req) {

    const id = connId++;
    const ip = req.headers['x-forwarded-for'] ?? req.socket.remoteAddress;

    if (verbose) console.log('Connected:', id, ip);

    const send = msg => ws.send(JSON.stringify(msg));

    let lastRecv = Date.now();
    let timer;
    const sender = setInterval(() => {
        send({ ping: Date.now() });
    }, interval);

    const bump = () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            if (verbose) console.log('Dead:', id, ip);
            ws.close();
        }, timeoutMs);
    }
    bump();

    if (verbose) ws.on('error', e => console.log('Error:', id, ip, e?.message ?? e));

    ws.on('close', () => {
        if (verbose) console.log('Closed:', id, ip);
        clearTimeout(timer);
        clearInterval(sender);
    });

    ws.on('message', function message(data) {
        try {
            if (verbose) console.log('Received:', id, ip, data);
            const msg = JSON.parse(data);
            const time = Date.now();
            const diff = time - lastRecv;
            lastRecv = time;
            send({
                pong: msg.ping,
                time,
                diff,
            });
        }
        catch (e) {
            if (verbose) console.log('Error:', id, ip, e);
            ws.close();
        }
    });

    send({
        ping: Date.now(),
        interval,
    });

});
