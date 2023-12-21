# TokenVest

This Dapp use the standart ERC 1155 to tokenize real estate assets. By combining the power of blockchain technology and smart contracts, this project aims to revolutionize the traditional real estate industry by introducing greater liquidity, accessibility, and efficiency.

## Smart Contracts

### Deployed Contracts (testnet)

You can find the list of deployed contract addresses [here](./contracts/scripts/config.json).

### Running Tests

```shell
cd contracts
npm install
npm test
```

## KYC

```mermaid
sequenceDiagram

User->>Platform: Login
Platform-->>Backend: Check if KYC done?
Backend-->>Platform: NOK
User->>KYC Provider: Do KYC
KYC Provider-->>Backend: KYC Data
User->>Platform: Login
Platform-->>Backend: Fetch KYC Signature
Backend-->>Platform: OK (v, r, s)
User->>Smart Contract: Submit Signature
```
