const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

module.exports = {
   networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
      gasLimit: 10000000, // <-- Use this high gas value
      gasPrice: 50000000000,
      disableConfirmationListener: true,
    },

    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8555, // <-- If you change this, also set the port option in .solcover.js.
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasLimit: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01, // <-- Use this low gas price
    },

    rinkeby: {
      provider: () =>
        new HDWalletProvider([process.env.PRIVATE_KEY], `wss://rinkeby.infura.io/ws/v3/${process.env.PROJECT_ID}`),
      network_id: 4,
      gas: 7000000,
      gasPrice: 30000000000, // 30 gwei
      skipDryRun: true,
    },

    ropsten: {
      provider: () =>
        new HDWalletProvider([process.env.PRIVATE_KEY], `wss://ropsten.infura.io/ws/v3/${process.env.PROJECT_ID}`),
      network_id: 3,
      gas: 7000000,
      gasPrice: 30000000000, // 30 gwei
      skipDryRun: true,
    },

    main: {
      provider: () =>
        new HDWalletProvider(process.env.PRIVATE_KEY, `https://mainnet.infura.io/v3/${process.env.PROJECT_ID}`),
      gas: 4000000,
      gasLimit: 4000000,
      gasPrice: 120000000000,
      network_id: 1,
    },
  },

  compilers: {
    solc: {
      version: "0.8.11",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },

  plugins: ["truffle-plugin-verify", "truffle-contract-size"],

  api_keys: {
    etherscan: process.env.ETHERSCAN_KEY,
  },
};
