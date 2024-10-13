import { createPublicClient, formatEther, http, parseTransaction, recoverTransactionAddress, serializeTransaction, validateTypedData } from 'viem';
import * as chains from 'viem/chains';
import { argv, exit } from 'node:process';

const response = JSON.parse(argv[2]);

const txData = parseTransaction(response.tx);
console.debug('Parsed transaction data');

if (txData.chainId === undefined) {
    console.error(`Transaction data is lacking of chainId`);
    exit(1);
}

const signature = {
    r: `0x${response.signature.big_r.affine_point.substring(2)}`,
    s: `0x${response.signature.s.scalar}`,
    yParity: response.signature.recovery_id,
};
console.debug('Transformed signature');

const signedTx = {
    ...signature,
    ...txData,
};
console.debug('Crafted signed transaction');

const tx = serializeTransaction(signedTx);
console.debug(`Serialized transaction: ${tx}`);

const supportedChains = Object.values(chains);

const chain = supportedChains.find((chain) => chain.id === txData.chainId);

if (!chain) {
    console.error(`Couldn't find supported chain with ID ${txData.chainId}`);
    exit(1);
}

console.debug(`Defined receiver chain: ${chain.name}(${chain.id})`);

const rpcUrl = chain.rpcUrls.default.http[0];

console.log(`Defined receiver RPC: ${rpcUrl}`);

const client = createPublicClient({
    transport: http(rpcUrl)
});

const sender = await recoverTransactionAddress({ serializedTransaction: tx });

try {
    console.log(`Fetching balance of sender: ${sender}`);

    const balance = await client.getBalance({ address: sender });

    if (balance === BigInt(0)) {
        console.warn(`Your balance is zero, transaction is likely to fail due to insufficient funds for gas unless you're using Gas Relayer!`);
    } else {
        console.log(`Balance: ${formatEther(balance, 'wei')}ETH`);
    }
} catch (error) {
    console.error(`RPC Server returned an error on balance request: ${error.details}`);
    exit(1);
}

try {
    console.log(`Relaying signed tx to RPC`);

    const hash = await client.sendRawTransaction({
        serializedTransaction: tx,
    });

    console.log(`Transaction Sent: ${chain.blockExplorers.default.url}/tx/${hash}`);
} catch (error) {
    console.error(`RPC Server returned an error on relaying tx: ${error.details}`);
    exit(1);
}



