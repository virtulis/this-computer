const baseHost = 'this.computer';

export default {

    baseHost,

    // This should only have an A record.
    ipv4Host: `4.${baseHost}`,
    // This should only have an AAAA record.
    ipv6Host: `6.${baseHost}`,

    graphWindow: 30_000,
    jitterWindow: 10_000,
    graphScale: 500, // ms

    pingServers: [
        {
            label: 'EU',
            host: baseHost,
        },
        /*{
            label: 'EU',
            host: baseHost,
        },*/
    ],

    pongServerPort: 1234,

};
