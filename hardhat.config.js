require("@nomicfoundation/hardhat-toolbox");

module.exports = {
    solidity: {
      compilers: [
        {
          version: "0.8.27", // 默认编译版本
          settings: {
            optimizer: {
              enabled: true,
              runs: 200,
            },
          },
        },
        {
          version: "0.5.16",
        },
        {
          version: "0.6.6",
        },
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
  };