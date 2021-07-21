const hre = require("hardhat");
const {
  confirmBeforeProceeding,
  waitForTrnx,
  logger,
  getUserInput,
} = require("../utils");

const MAINNET = process.env.MAINNET === "true" ? true : false;

async function main() {
  if (MAINNET) {
    await confirmBeforeProceeding(
      "You are about to burn a token on Polygon Mainnet - are you sure?",
      true
    );
  }

  const CONTRACT_ADDRESS = await getUserInput(
    "What is the contract address for the token from?"
  );
  let TOKEN_ID_TO_BURN = parseInt(
    await getUserInput("What token ID do you want to burn?")
  );

  const NFT = await hre.ethers.getContractFactory("MeebitsDAOTickets");
  const contract = NFT.attach(CONTRACT_ADDRESS);
  const transaction = await contract.burn(TOKEN_ID_TO_BURN);
  await waitForTrnx(transaction.hash);

  console.log(
    `NFT #${TOKEN_ID_TO_BURN} burned | Transaction Hash: ${transaction.hash}`
  );
  console.log("Done burning!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
