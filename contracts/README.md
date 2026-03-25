# Contracts Directory

Contains the smart contracts for BondCredit's volatility-aware rebalancer on Hedera.

## Quick Start

### 1. Install Dependencies

```bash
cd contracts
npm install
```

### 2. Set Up Environment

The deployment script reads from the root `.env` file:
- `HEDERA_PRIVATE_KEY` — Your Hedera account's private key
- `HEDERA_ACCOUNT_ID` — Your Hedera account ID (optional, for reference)

Make sure your `.env` in the root directory has these values.

### 3. Deploy Contract

```bash
# Deploy to Hedera Testnet
npx hardhat run scripts/deploy.js --network hedera-testnet

# Deploy to Hedera Mainnet (after testing thoroughly)
npx hardhat run scripts/deploy.js --network hedera-mainnet
```

### 4. Update .env

After deployment, the script will output your contract address. Copy it to your `.env` file:

```env
BONZO_VAULT_ID=0x... (contract address from deployment)
```

### 5. Start the Agent

From the root directory:

```bash
npm start
```

The agent will now interact with your live contract on Hedera.

## Contract Overview

**BonzoVault.sol** — A simplified vault contract that stores liquidity position ranges and tracks deposits.

Three critical functions for the agent:
- `getCurrentTick()` — Returns current pool position
- `adjustRange(lowerTick, upperTick)` — Updates liquidity bounds
- `withdrawToStaking()` — Emergency withdrawal to staking

## Files

- **BonzoVault.sol** — Main smart contract
- **hardhat.config.js** — Hardhat configuration for Hedera networks
- **scripts/deploy.js** — Deployment script
- **DEPLOYMENT.md** — Detailed deployment guide with alternatives
- **package.json** — Dependencies and scripts

## Network Configuration

### Hedera Testnet

- **RPC:** https://testnet.hashio.io/api
- **Chain ID:** 296
- **Faucet:** https://portal.hedera.com/faucet
- **Explorer:** https://testnet.hashscan.io

### Hedera Mainnet

- **RPC:** https://mainnet.hashio.io/api
- **Chain ID:** 295
- **Explorer:** https://mainnet.hashscan.io

## Troubleshooting

### "HEDERA_PRIVATE_KEY not found"

Make sure your `.env` file in the root directory contains:

```env
HEDERA_PRIVATE_KEY=0x...
```

### "Insufficient funds"

Get testnet HBAR from the faucet:
https://portal.hedera.com/faucet

### "Contract deployment failed"

Check:
1. Private key is valid (0xformat, 64 hex chars)
2. Account has at least 1 HBAR
3. Network is reachable (check RPC URL)

## After Deployment

1. **Verify Contract:** Visit HashScan explorer and look up your contract address
2. **Check Agent Logs:** Run `npm start` and watch for Hedera client initialization
3. **Monitor Transactions:** All agent actions appear on HashScan
4. **Test Adjustments:** Send manual chat commands via the frontend to trigger contract calls

## Security Note

This is a **scaffold contract** for hackathon/demo purposes. For production:

- Implement proper access control
- Add emergency pause mechanisms
- Include formal verification
- Professional security audit
- Reentrancy protection
- Rate limiting and safeguards

## Further Reading

- [Hedera Solidity Documentation](https://docs.hedera.com/guides/smart-contracts/solidity-contracts)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Remix IDE (Alternative Deployment)](https://remix.ethereum.org)
