import DKG from 'dkg.js';

export function createDkgClient() {
    return new DKG({
        environment: "mainnet",
        endpoint: "https://nebula.mainnet.truthchain.dev",
        port: 443,
        blockchain: {
            name: "otp:2043"
        },
    });
}