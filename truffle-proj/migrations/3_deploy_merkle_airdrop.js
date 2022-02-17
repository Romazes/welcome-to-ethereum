const MerkleAirdrop = artifacts.require("MerkleAirdrop");
const MerkleAirdropToken = artifacts.require("MerkleAirdropToken");

module.exports = function (deployer) {
  deployer.deploy(MerkleAirdropToken);
};
