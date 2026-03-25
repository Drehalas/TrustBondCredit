const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying BonzoVault contract to Hedera Testnet...");

  // Get signer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Hedera JSON-RPC can fail fee simulation with auto-estimation on some setups.
  // Use explicit gas settings from the live RPC gas price.
  const feeData = await hre.ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice ?? BigInt(await hre.ethers.provider.send("eth_gasPrice", []));
  const gasLimit = 3_000_000n;
  console.log("Using gasPrice:", gasPrice.toString(), "wei");
  console.log("Using gasLimit:", gasLimit.toString());

  // Deploy contract
  const BonzoVault = await hre.ethers.getContractFactory("BonzoVault");
  const vault = await BonzoVault.deploy({ gasPrice, gasLimit });
  await vault.waitForDeployment();

  const vaultAddress = await vault.getAddress();
  console.log("\n✅ BonzoVault deployed successfully!");
  console.log("📍 Contract Address:", vaultAddress);

  // Save deployment info
  const deploymentInfo = {
    contract: "BonzoVault",
    address: vaultAddress,
    owner: deployer.address,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
  };

  const deploymentPath = path.join(__dirname, "../deployments.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("📄 Deployment info saved to: contracts/deployments.json");

  // Display next steps
  console.log("\n📋 Next Steps:");
  console.log("1. Update .env with:");

  // Convert Ethereum-style address to Hedera format if needed
  let hederaAddress = vaultAddress;
  if (vaultAddress.startsWith("0x")) {
    // This is already in Hedera format or needs conversion
    console.log(`   BONZO_VAULT_ID=${hederaAddress}`);
  }

  console.log("\n2. Verify contract on HashScan:");
  console.log(`   https://testnet.hashscan.io/address/${vaultAddress}`);

  console.log("\n3. Start the agent:");
  console.log("   npm start");

  console.log("\n4. Monitor transactions:");
  console.log("   https://testnet.hashscan.io/address/0.0.8330349");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
