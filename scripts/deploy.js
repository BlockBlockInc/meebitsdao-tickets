const hre = require("hardhat");
const { confirmBeforeProceeding } = require("../utils");

const MAINNET = process.env.MAINNET === "true" ? true : false;

async function main() {
  if (MAINNET) {
    await confirmBeforeProceeding(
      "You are about to deploy contract to Polygon Mainnet - are you sure?",
      true
    );
  }

  const TicketToken = await hre.ethers.getContractFactory("MeebitsDAOTickets");
  const ticketToken = await TicketToken.deploy();
  console.log(`Deploying - waitng... ${ticketToken.address}`);
  await ticketToken.deployed();
  console.log("MeebitsDAOTickets deployed to:", ticketToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
