const hre = require("hardhat");
const {
  confirmBeforeProceeding,
  waitForTrnx,
  pinToIPFS,
  logger,
  getUserInput,
} = require("../utils");
const { redTicketMetadata } = require("../metadata");
const path = require("path");
const csv = require("csvtojson");
const BigNumber = require("@ethersproject/bignumber").BigNumber;

const MAINNET = process.env.MAINNET === "true" ? true : false;

async function main() {
  if (MAINNET) {
    await confirmBeforeProceeding(
      "You are about to mint to Polygon Mainnet - are you sure?",
      true
    );
  }

  const PATH = await getUserInput("What is the name of the address CSV file?");
  const CSV_FILE_PATH = path.join(__dirname, PATH);
  const users = await csv().fromFile(CSV_FILE_PATH);

  const CONTRACT_ADDRESS = await getUserInput(
    "What is the contract address you want to mint from?"
  );
  let current_series_id = parseInt(
    await getUserInput("What is the series ID number we should start from?")
  );

  let START_FROM = parseInt(
    await getUserInput("Which index should we start from in the CSV?")
  );

  const NFT = await hre.ethers.getContractFactory("MeebitsDAOTickets");
  const contract = NFT.attach(CONTRACT_ADDRESS);

  for (let i = START_FROM; i < users.length; i++) {
    const user = users[i];
    const metadata = redTicketMetadata(current_series_id);
    const pinataName = `red_ticket_token_#${current_series_id}_metadata.json`;
    const uri = await pinToIPFS(pinataName, metadata);

    const run = async () => {
      let transaction = {};

      try {
        transaction = await contract["safeMint(address,string)"](
          user.address,
          uri,
          { gasLimit: BigNumber.from("200000") }
        );
      } catch (e) {
        console.log(e);
        throw e;
      }

      console.log(transaction.hash);
      await waitForTrnx(transaction.hash);

      logger.log(
        `NFT #${current_series_id} minted for address: ${user.address} | Transaction Hash: ${transaction.hash} | Metadata: ${uri}`
      );
      current_series_id++;
      return;
    };

    await run();
  }
  console.log("Done minting!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
