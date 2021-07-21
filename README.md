# meebitsdao-tickets

## Design

The MeebitsDAO Ticket Token is an ERC-721, implementing OpenZepplin [ERC721Burnable](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721Burnable), [ERC721URIStorage](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721URIStorage), and [AccessControl](https://docs.openzeppelin.com/contracts/4.x/api/access#AccessControl).

Contract address on Polygon: [0xB3E7DF09eB3F0a5E2150c75Bd71F583fC83EE193](https://polygonscan.com/address/0xb3e7df09eb3f0a5e2150c75bd71f583fc83ee193)

<img src="https://ipfs.io/ipfs/QmYNAkKi4AhiFeknPrnUPxAJTrZ3KgfjF2QHDpjq7DHxfH" width="300" height="300">

## Setup 

Install: 

```
yarn install
```

Create a `.env` file in the root directory with the variables from the `.env.template` file.

## Lint / Format 
 
```
yarn lint
```
Lints/formats solidity contracts & javascript scripts/tests. 


## Test

```
yarn test
```

## Deploy Contract
```
yarn deploy-mumbai
```
or
```
yarn deploy-mainnet
```

This runs the `deploy.js` script with the specified network. Outputs the contract address.

## Mint Tokens

Add a CSV file to `/scripts` directory of this project that cointains a list of addresses to mint to.

```
yarn mint-mumbai
```
or
```
yarn mint-mainnet
```

This runs the `bulk-mint.js` script with the specified network.

## Burn & Remint a Token

If a token's metadata needs to be changed, we can burn the token & then remint it.

```
yarn burn-mumbai
```
or
```
yarn burn-mainnet
```

This runs the `burn.js` script with the specified network.

Then, re-mint the specific token after burning:

```
yarn mint-single-mumbai
```
or
```
yarn mint-single-mainnet
```

## Contract Verification

Verify contract on Polygonscan

```
npx hardhat verify --network matic <contract address>
```
