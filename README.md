# hardhat-practice
给各大开源项目写单元测试和部署脚本，从实战过程中加深对开源项目的理解

## 设置 gasLimit
const options = { gasLimit: 1000 };
const tx = await uniswapFactory.createPair(airplaneToken.target, rocketToken.target, options);

