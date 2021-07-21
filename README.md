# meebitsdao-achievement-tokens

## Design

The MeebitsDAO Ticket Token is an ERC-721, implementing OpenZepplin [ERC721Burnable](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721Burnable), [ERC721URIStorage](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721URIStorage), and [AccessControl](https://docs.openzeppelin.com/contracts/4.x/api/access#AccessControl).

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

Verify contract on polygonscan
```
npx hardhat verify --network matic <contract address>
```
