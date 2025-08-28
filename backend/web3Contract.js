const Web3 = require('web3');
const LandRegistry = require('../artifacts/contracts/LandRegistry.sol/LandRegistry.json');

const web3 = new Web3('http://localhost:8545'); // Ganache local RPC

// Manually set contract address (replace with your actual deployed address)
const contractAddress = process.env.LAND_REGISTRY_ADDRESS || '0xe2b293dbec78dD755c2D7A9878a005e30FBec304';

// Create contract instance
const contract = new web3.eth.Contract(LandRegistry.abi, contractAddress);

// Get first account from Ganache
let account;
web3.eth.getAccounts().then(accounts => {
  account = { address: accounts[0] };
  console.log('Using account:', account.address);
}).catch(err => {
  console.error('Error fetching accounts:', err);
});

module.exports = { contract, account };
