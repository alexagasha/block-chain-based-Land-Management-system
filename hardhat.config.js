require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: {
    version: '0.8.0',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      },
      viaIR: true // Enable IR-based compilation
    }
  },
  networks: {
    ganache: {
      url: 'http://127.0.0.1:8545',
      chainId: 1337,
      accounts: ['0x0999a3039239f1a3c34a489e57ca7185442b36b8bb5850a41efd4b71457490c7']
    }
  }
};