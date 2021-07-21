require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3"); // Required for OpenZeppelin test-helpers
require('dotenv').config();
require("@nomiclabs/hardhat-etherscan");

const PRIVATE_KEY_MUMBAI = process.env.PRIVATE_KEY_MUMBAI || null;
const PRIVATE_KEY_MAINNET = process.env.PRIVATE_KEY_MAINNET || null;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

let config = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: false,
        runs: 200
      }
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
  }
}

if (PRIVATE_KEY_MUMBAI !== null) {
  config = {
    ...config,
    networks: {
      ...config.networks,
      mumbai: {
        url: "https://rpc-mumbai.maticvigil.com",
        accounts: [`0x${PRIVATE_KEY_MUMBAI}`]
      }
    }
  }
}

if (PRIVATE_KEY_MAINNET !== null) {
  config = {
    ...config,
    networks: {
      ...config.networks,
      matic: {
        url: "https://rpc-mainnet.maticvigil.com",
        accounts: [`0x${PRIVATE_KEY_MAINNET}`]
      },
    }
  }
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  ...config
};
