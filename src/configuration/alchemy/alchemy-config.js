//provider
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

// alchemy provider set-up
// const alchemyKey = process.env.REACT_APP_ALCHEMY_PROVIDER_BASE_URL;
const alchemyKey =
  "https://polygon-mumbai.g.alchemy.com/v2/8kbfGe4lz8I7NRg5PbtvkJG1Fw7Rz6iu";
// const alchemyKey =
//   "https://eth-goerli.alchemyapi.io/v2/Xn9WOwHwTorvsrB5vMYUZWA5GYIGJkSx";
export const web3 = createAlchemyWeb3(alchemyKey);

//abi exports
export const utilityABI = require("../../contracts/utilityABI.json");

export const contractAddress = "0x916e45A8eFC3aA541AAc4B42FA927b5ee5450AD7";
// export const contractAddress = "0x93D38123f5ebB20dA635435Af136b0aa2fBae43b";

export const contractInstance = new web3.eth.Contract(
  utilityABI,
  contractAddress
);
