async function main() {
    let contract  = null;

    contract = await ethers.deployContract("UpgradeableToken1");
    await contract.waitForDeployment();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
