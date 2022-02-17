const Ethers = require("ethers");
const Crypto = require("crypto");
const keccak256 = require("keccak256");
const Merkletreejs = require("merkletreejs");
const MerkleAirdrop = artifacts.require("MerkleAirdrop");
const MerkleAirdropToken = artifacts.require("MerkleAirdropToken");

contract("Merkle Airdrop", (accounts) => {
  it("Full Cycle", async () => {
    const [signer, guy] = accounts;

    const token = await MerkleAirdropToken.deployed();

    const randomAddresses = new Array(15)
      .fill(0)
      .map(
        () => new Ethers.Wallet(Crypto.randomBytes(32).toString("hex")).address
      );

    const merkleTree = new Merkletreejs.MerkleTree(
      randomAddresses.concat(signer),
      keccak256,
      { hashLeaves: true, sortPairs: true }
    );

    const root = merkleTree.getHexRoot();

    const airdrop = await MerkleAirdrop.new(token.address, root);

    await token.transfer(airdrop.address, Ethers.utils.parseEther("10"));

    const proof = merkleTree.getHexProof(keccak256(signer));

    let isSignerClaimed = await airdrop.claimed(signer);
    assert.equal(
      isSignerClaimed,
      false,
      "Before claim: The Signer has claimed reward already."
    );

    let isSignerCanClaim = await airdrop.canClaim(signer, proof);
    assert.equal(
      isSignerCanClaim,
      true,
      "Before claim: The Signer hasn't claimed reward yet."
    );

    await airdrop.claim(proof, { from: signer });

    let signerBalanceToken = getTokenInHumanReadableType(
      await token.balanceOf(signer)
    );
    assert.equal(
      signerBalanceToken,
      1,
      "The signer balance has not increased."
    );

    let airdropContractbalance = getTokenInHumanReadableType(
      await token.balanceOf(airdrop.address)
    );
    assert.equal(
      airdropContractbalance,
      9,
      "The airdrop contract balance hasn't changed."
    );

    assert.equal(
      await airdrop.claimed(signer),
      true,
      "After claim: The Signer hasn't claimed reward yet."
    );

    assert.equal(
      await airdrop.canClaim(signer, proof),
      false,
      "After claim: The Signer has claimed reward already."
    );

    await assertClaimRewardFromAirdrop(
      airdrop,
      proof,
      guy,
      "MerkleAirdrop: Address is not a candidate for claim",
      "The Signer cannot get the reward twice time."
    );

    assert.equal(
      await airdrop.claimed(guy),
      false,
      "The Guy has claimed reward alreay."
    );

    assert.equal(
      await airdrop.canClaim(guy, proof),
      false,
      "The Guy hasn't claimed reward yet."
    );

    await assertClaimRewardFromAirdrop(
      airdrop,
      proof,
      guy,
      "MerkleAirdrop: Address is not a candidate for claim",
      "The Guy cannot get the reward."
    );

    const badProof = merkleTree.getHexProof(keccak256(guy));

    console.log(`BadProof: ${badProof}`);

    // in js: `!string.length` true - array empty || false - array has element(s)
    assert.equal(!badProof.length, true, "The Proof doesn't bad!");

    assert.equal(
      await airdrop.canClaim(guy, badProof),
      false,
      "The Guy hasn't claimed reward, because the Hex Proof not correct."
    );

    await assertClaimRewardFromAirdrop(airdrop, badProof, guy);
  });
});

function getTokenInHumanReadableType(balance) {
  let amountBigInt = Ethers.BigNumber.from(balance.toString());
  return Ethers.utils.formatEther(amountBigInt);
}

async function assertClaimRewardFromAirdrop(
  airdropContract,
  hexProof,
  userAddress,
  expectedError = "MerkleAirdrop: Address is not a candidate for claim",
  errorIfExpectedErrorNotThrow = "The User cannot get the reward with Bad Hex Proof"
) {
  try {
    await airdropContract.claim(hexProof, { from: userAddress });
    assert.fail(errorIfExpectedErrorNotThrow);
  } catch (err) {
    const actualError = err.reason;
    assert.equal(actualError, expectedError, "should not be permitted");
  }
}
