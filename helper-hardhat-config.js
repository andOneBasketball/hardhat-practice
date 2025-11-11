const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337: {
        name: "localhost",
    },
    // Price Feed Address, values can be obtained at https://docs.chain.link/data-feeds/price-feeds/addresses
    11155111: {
        name: "sepolia",
        checkInterval: 120,
    },
};

const upgradeProxy = {
    11155111: {
        "counterUpgradeUups": "0x6f14c9aDFEB973781A03CB8300c3B9234a272Ec4",
    },
    97: {
        "counterUpgrade": "0xdC4F6823cE6524C872E1d9B0c6d30Aef632CCD3E",
        "counterUpgradeUups": "0xd1EbF9801B03a13f2468630D22b9afef251Bb1fA",
    },
};

const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;

module.exports = {
    networkConfig,
    upgradeProxy,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
};
