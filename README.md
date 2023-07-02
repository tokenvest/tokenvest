# TokenVest

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
