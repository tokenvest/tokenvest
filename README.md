# TokenVest by ShitCoinShacks

ERC-1155 for the apartment
KYC contract
PayoutSettlementContract => money arrives there and flag is set for "payout claimable"
ListingContract
TradingContract

TODO: Reginald => out of the box multisig capabilities

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
