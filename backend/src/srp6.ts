import crypto from 'crypto';

export function calculateSrp6Verifier(username: string, password: string, salt: Buffer): Buffer {
    const g = Buffer.from([7]);
    const N = Buffer.from('894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7', 'hex');
    
    const h1 = crypto.createHash('sha1').update(`${username.toUpperCase()}:${password.toUpperCase()}`).digest();
    const h2 = crypto.createHash('sha1').update(salt).update(h1).digest();
    
    // Это упрощенная реализация логики BigInt для вычисления (g^h2) % N
    const h2BI = BigInt(`0x${h2.toString('hex')}`);
    const gBI = BigInt(7);
    const NBI = BigInt(`0x${N.toString('hex')}`);
    
    const verifierBI = powerMod(gBI, h2BI, NBI);
    let verifierHex = verifierBI.toString(16);
    if (verifierHex.length % 2 !== 0) verifierHex = '0' + verifierHex;
    
    return Buffer.from(verifierHex, 'hex').reverse(); // AzerothCore хранит в обратном порядке
}

function powerMod(base: bigint, exp: bigint, mod: bigint): bigint {
    let res = BigInt(1);
    base = base % mod;
    while (exp > 0) {
        if (exp % BigInt(2) === BigInt(1)) res = (res * base) % mod;
        base = (base * base) % mod;
        exp = exp / BigInt(2);
    }
    return res;
}