const inquirer = require("inquirer");
const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const { Console } = console;

const MAINNET = process.env.MAINNET === "true" ? true : false;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const INFURA_PROJECT_SECRET = process.env.INFURA_PROJECT_SECRET;
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;
const pinata = pinataSDK(PINATA_API_KEY, PINATA_SECRET_KEY);

// Printing logs
const output = fs.createWriteStream(`./bulk-mint-${new Date()}.log`);
const errorOutput = fs.createWriteStream(`./bulk-mint-ERROR-${new Date()}.log`);
// custom simple logger
const logger = new Console(output, errorOutput);

/**
 * Returns true if script should proceed.
 * @param {boolean} shouldThrow If true, will throw if the user does not enter yes. Defaults to false.
 * @param {string} message Message you want to appear on confirmation.
 */
async function confirmBeforeProceeding(
  confirmationMessage,
  shouldThrow = false
) {
  const questions = [
    {
      type: "input",
      name: "confirmation",
      message: `${confirmationMessage} Type 'c' to continue:`,
    },
  ];
  const inputs = await inquirer.prompt(questions);
  if (inputs.confirmation !== "c") {
    if (shouldThrow) {
      throw new Error("Did not confirm with `c`");
    }
    return false;
  } else {
    return true;
  }
}

/**
 * Returns user input.
 * @param {string} message Message for question
 * Throws if no valid input is found.
 */
async function getUserInput(message) {
  const questions = [
    {
      type: "input",
      name: "input",
      message: message,
    },
  ];
  const inputs = await inquirer.prompt(questions);
  if (!inputs.input || inputs.input == "") {
    throw new Error("Invalid input");
  } else {
    return inputs.input;
  }
}

const infuraUrl = MAINNET
  ? `https://polygon-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`
  : `https://polygon-mumbai.infura.io/v3/${INFURA_PROJECT_ID}`;
const provider = hre.ethers.getDefaultProvider(infuraUrl, {
  infura: {
    projectId: INFURA_PROJECT_ID,
    projectSecret: INFURA_PROJECT_SECRET,
  },
});

/**
 * Waits for transaction to be confirmed
 * @param {string} hash Pending transaction hash.
 */
async function waitForTrnx(hash) {
  const receipt = await provider.waitForTransaction(hash);
  if (receipt.status != 1) {
    const errMessage = `Error minting, stopping. Hash: ${hash}`;
    logger.error(errMessage);
    throw new Error(errMessage);
  }
}

/**
 * Returns IPFS URI of pin
 * @param {string} pinataName Name for pinata upload.
 * @param {string} jsonMetadata JSON metadata to pin.
 */
async function pinToIPFS(pinataName, jsonMetadata) {
  const pinataOptions = {
    pinataMetadata: {
      name: pinataName,
    },
  };

  const resp = await pinata
    .pinJSONToIPFS(jsonMetadata, pinataOptions)
    .catch((err) => {
      logger.error(err);
      throw new Error(`Error pinning #${i}, stopping.`);
    });

  return `ipfs://${resp.IpfsHash}`;
}

module.exports = {
  confirmBeforeProceeding,
  getUserInput,
  provider,
  waitForTrnx,
  pinToIPFS,
  logger,
};
