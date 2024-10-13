# Near Multi-chain DAO Scripts

The script `relay.mjs` is designed to simplify the process of relaying a transaction to an EVM (Ethereum Virtual Machine) Chain after it has been signed using a [Multi-chain DAO Contract](https://github.com/nearuaguild/abstract-dao).

## Key Features

- Transform Multi-chain DAO Signature into EVM-compatible Transaction

- Automatic Chain and RPC Detection

## Installation

Clone the repository.

```bash
git clone https://github.com/nearuaguild/multichain-dao-scripts.git
cd multichain-dao-scripts
```

Install dependencies.

```bash
yarn install
```

## Usage Example

To relay a transaction, simply run the following command with the result of `get_signature` function from [Multi-chain DAO Contract](https://github.com/nearuaguild/abstract-dao) (in single-quotes):

```bash
node relay.mjs '{
  "signature": {
    "big_r": {
      "affine_point": "0308A7FF4619600590034D9EDE05A8D7A7E17AADD2993DD395BD9E6C5ABD69E22E"
    },
    "recovery_id": 0,
    "s": {
      "scalar": "083EA0066955982DAE8E474D3EE34DB817764F3AF8AE84D956CA0A58F431180A"
    }
  },
  "tx": "0x02f85083aa36a701850485034c878517a4eb0789829dd094e2a01146fffc8432497ae49a7a6cba5b9abd71a380a460fe47b10000000000000000000000000000000000000000000000000000000000000a97c0"
}'
```
