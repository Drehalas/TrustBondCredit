require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "../.env" });

module.exports = {
  solidity: "0.8.20",
  networks: {
    "hedera-testnet": {
      url: "https://testnet.hashio.io/api",
      accounts: [process.env.HEDERA_PRIVATE_KEY || ""],
      chainId: 296,
      gas: "auto",
      gasPrice: "auto",
    },
    "hedera-mainnet": {
      url: "https://mainnet.hashio.io/api",
      accounts: [process.env.HEDERA_PRIVATE_KEY || ""],
      chainId: 295,
      gas: "auto",
      gasPrice: "auto",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    artifacts: "./artifacts",
  },
};
