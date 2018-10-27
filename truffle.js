module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"   // Match any network id
    },
    ganache: {
        host: "3.121.27.97",
        port: 8545,
        network_id: "*"   // Match any network id
    }
  },

  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
