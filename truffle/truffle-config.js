require('dotenv').config()  // store environment variables from '.env' to process.env

module.exports = {
  contracts_build_directory: "../client/src/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 22000,
      network_id: "*",
      gasPrice: 0,
      gas: 4500000,
      type: "quorum",
      chainId: 10
    },
    nodefour: {
      host: "127.0.0.1",
      port: 22003,
      network_id: "*", // Match any network id
      gasPrice: 0,
      gas: 4500000,
      type: "quorum", // needed for Truffle to support Quorum
    },
    nodeseven: {
      host: "127.0.0.1",
      port: 22006,
      network_id: "*", // Match any network id
      gasPrice: 0,
      gas: 4500000,
      type: "quorum", // needed for Truffle to support Quorum
    },
    // quorumNw: {
    //   // Provider has to be wrapped into a function
    //   // provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.RPC_URL),
    //   host: "127.0.0.1",
    //   port: 22000, // was 8545
    //   network_id: "*", // Any network (default: none)
    //   gasPrice: 0,
    //   gas: 4500000,
    //   type: "quorum",
    //   chainId: 10
    // }
  },
  compilers: {
    solc: {
      version: "0.8.17"
    }
  }
};
