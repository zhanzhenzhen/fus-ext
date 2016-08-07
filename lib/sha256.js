// TODO: For now the size limit is 2^32 bytes.

import * as $array from "./array";

export default bytes => {
    if (bytes.length > Math.round(Math.pow(2, 31) - 1)) throw new Error();
    let wordToBytes = n =>
        [7, 6, 5, 4, 3, 2, 1, 0].map(i => (n >>> (i * 4)) % 16);
    let add = (...args) => {
        let r = 0;
        args.forEach(arg => {
            r = (r + arg) % 0x100000000;
        });
        return r;
    };
    let ROTR = (x, n) => x >>> n | x << (32 - n);
    let SHR = (x, n) => x >>> n;
    let Ch = (x, y, z) => (x & y) ^ (~x & z);
    let Maj = (x, y, z) => (x & y) ^ (x & z) ^ (y & z);
    let SIGMA0 = x => ROTR(x, 2) ^ ROTR(x, 13) ^ ROTR(x, 22);
    let SIGMA1 = x => ROTR(x, 6) ^ ROTR(x, 11) ^ ROTR(x, 25);
    let sigma0 = x => ROTR(x, 7) ^ ROTR(x, 18) ^ SHR(x, 3);
    let sigma1 = x => ROTR(x, 17) ^ ROTR(x, 19) ^ SHR(x, 10);
    let K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    // preprocessing ========================================[
    let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    bytes = Array.from(bytes);
    let l = bytes.length * 8;
    let k = 448 - l - 1;
    while (k < 0) {
        k += 512;
    }
    let paddedLength = l + 1 + k + 64;
    bytes.push(0x80);
    for (let i = 0; i < Math.round((k - 7) / 8); i++) {
        bytes.push(0);
    }
    // This only supports max length of 2^32. -----[
    bytes.push(0);
    bytes.push(0);
    bytes.push(0);
    bytes.push(0);
    bytes.push(l >>> 24);
    bytes.push((l >>> 16) % 256);
    bytes.push((l >>> 8) % 256);
    bytes.push(l % 256);
    // ]--------------------
    let N = Math.round(paddedLength / 512);
    let M = new Array(N);
    for (let i = 0; i < N; i++) {
        M[i] = new Array(16);
        for (let j = 0; j < 16; j++) {
            let offset = i * 64 + j * 4;
            M[i][j] =
                (bytes[offset] << 24) | (bytes[offset + 1] << 16) |
                (bytes[offset + 2] << 8) | bytes[offset + 3];
        }
    }
    // ]==================== hash computation ====================[
    let W = new Array(64);
    for (let i = 0; i < N; i++) {
        for (let t = 0; t < 64; t++) {
            W[t] = t < 16 ?
                M[i][t] :
                add(sigma1(W[t - 2]), W[t - 7], sigma0(W[t - 15]), W[t - 16]);
        }
        let a = H[0];
        let b = H[1];
        let c = H[2];
        let d = H[3];
        let e = H[4];
        let f = H[5];
        let g = H[6];
        let h = H[7];
        for (let t = 0; t < 64; t++) {
            let T1 = add(h, SIGMA1(e), Ch(e, f, g), K[t], W[t]);
            let T2 = add(SIGMA0(a), Maj(a, b, c));
            h = g;
            g = f;
            f = e;
            e = add(d, T1);
            d = c;
            c = b;
            b = a;
            a = add(T1, T2);
        }
        H[0] = add(a, H[0]);
        H[1] = add(b, H[1]);
        H[2] = add(c, H[2]);
        H[3] = add(d, H[3]);
        H[4] = add(e, H[4]);
        H[5] = add(f, H[5]);
        H[6] = add(g, H[6]);
        H[7] = add(h, H[7]);
    }
    // ]========================================
    return new Uint8Array($array.flatten(H.map(m => wordToString(m))));
};
