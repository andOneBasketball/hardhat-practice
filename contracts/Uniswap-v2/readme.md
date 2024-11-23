npm install @uniswap/v2-core
npm install @openzeppelin/contracts
npm install @uniswap/v2-periphery

需要将 hardhat-practice\node_modules\@uniswap\v2-periphery\contracts\libraries\UniswapV2Library.sol 中 pairFor 函数最后一个参数改为 0xe699c2c70a1e9ca16c58b40782745b5d609738b755845b6ee18a18d21352f753（ethers.keccak256(UniswapV2Pair.bytecode)）

npx hardhat ignition deploy ignition/modules/Uniswap-v2/Uniswap-v2.js  --network localhost
npx hardhat ignition deploy ignition/modules/Uniswap-v2/Uniswap-v2-router01.js  --network localhost

npx hardhat run scripts/Uniswap-v2/uniswap_route.js --network localhost