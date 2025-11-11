require("hardhat-deploy");
require("@openzeppelin/hardhat-upgrades");
require("@nomicfoundation/hardhat-verify");
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const ETH_URL = process.env.ETH_URL;
const BSC_URL = process.env.BSC_URL;
const POL_URL = process.env.POL_URL;

const SEPOLIA_URL = process.env.SEPOLIA_URL;
const BSC_TESTNET_URL = process.env.BSC_TESTNET_URL;
const POLYGON_TEST_URL = process.env.POLYGON_TEST_URL;


const PRIVATE_KEY = process.env.PRIVATE_KEY;
const LOCAL_PRIVATE_KEY = process.env.LOCAL_PRIVATE_KEY;

const EVM_SCAN_API_KEY = process.env.EVM_SCAN_API_KEY;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.27", // 默认编译版本
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.19",
      },
      {
        version: "0.8.17",
      },
      {
        version: "0.5.16",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.4.24",
      }
    ],
    // 对特定文件或目录使用不同的编译器版本
    overrides: {
      "contracts/Uniswap-v2/InstanceUniswapV2.sol": {
        version: "0.5.16",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
      "contracts/Uniswap-v2/InstanceUniswapV2Periphery.sol": {
        version: "0.6.6",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
    },
  },
  networks: {
    localhost: {
      chainId: 31337,
      accounts: [LOCAL_PRIVATE_KEY],
    },
    hardhat: {
      live: true,
      saveDeployments: true,
      deploy: { autoDeploy: false },
    },
    eth: {
      url: ETH_URL,
      accounts: [PRIVATE_KEY],
      chainId: 1,
    },
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111
    },
    bsc: {
      url: BSC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 56
    },
    bscTestnet: {
      url: BSC_TESTNET_URL,
      accounts: [PRIVATE_KEY],
      chainId: 97,
      gasPrice: 3e9,
    },
    polygonAmoy: {
      url: POLYGON_TEST_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80002
    },
    polygon: {
      url: POL_URL,
      accounts: [PRIVATE_KEY],
      chainId: 137
    }
  },
  etherscan: {
    // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: EVM_SCAN_API_KEY,
    customChains: [
      {
        network: "bsc",
        chainId: 56,
        urls: {
          apiURL: "https://api.bscscan.com/api",
          browserURL: "https://bscscan.com"
        }
      },
      {
        network: "bscTestnet",
        chainId: 97,
        urls: {
          apiURL: "https://api-testnet.bscscan.com/api",
          browserURL: "https://testnet.bscscan.com"
        }
      },
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com"
        }
      },
      {
        network: "polygon",
        chainId: 137,
        urls: {
          apiURL: "https://api.polygonscan.com/api",
          browserURL: "https://polygonscan.com/"
        }
      }
    ]
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: false
  },

  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
        1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    player: {
        default: 1,
    },
  },
  gasReporter: {
    enabled: false
  },
  mocha: {
    timeout: 500000, // 500 seconds max for running tests
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./build/cache",
    artifacts: "./build/artifacts"
  },
};