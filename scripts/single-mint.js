const hre = require("hardhat");
const {
  confirmBeforeProceeding,
  waitForTrnx,
  pinToIPFS,
  logger,
  getUserInput,
} = require("../utils");
const { redTicketMetadata } = require("../metadata");

const MAINNET = process.env.MAINNET === "true" ? true : false;

async function main() {
  if (MAINNET) {
    await confirmBeforeProceeding(
      "You are about to mint to Polygon Mainnet - are you sure?",
      true
    );
  }
  const WALLET_ADDRESS = await getUserInput(
    "What is the wallet address you want to mint the token to?"
  );
  const CONTRACT_ADDRESS = await getUserInput(
    "What is the contract address you want to mint from?"
  );
  const TOKEN_ID = parseInt(
    await getUserInput("What is the token ID you want to mint?")
  );
  const SERIES_ID = parseInt(
    await getUserInput("What is the series ID number for the token?")
  );

  const NFT = await hre.ethers.getContractFactory("MeebitsDAOTickets");
  const contract = NFT.attach(CONTRACT_ADDRESS);

  const metadata = redTicketMetadata(SERIES_ID);
  const pinataName = `red_ticket_token_#${SERIES_ID}_metadata.json`;
  const uri = await pinToIPFS(pinataName, metadata);

  const transaction = await contract["safeMint(address,uint256,string)"](
    WALLET_ADDRESS,
    TOKEN_ID,
    uri
  );
  await waitForTrnx(transaction.hash);

  console.log(
    `NFT #${TOKEN_ID} minted for address: ${WALLET_ADDRESS} | Transaction Hash: ${transaction.hash} | Metadata: ${uri}`
  );
  console.log("Done minting!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
