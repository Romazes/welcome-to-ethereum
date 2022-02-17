const HarrowingTokenContract = artifacts.require("HarrowingToken");
const BigNumber = require("bignumber.js");

function toBigNumber(num) {
    return new BigNumber(num);
}

contract("HarrowingToken", async (accounts) => {
    let harrowingToken;
    const owner = accounts[0];
    const user1 = accounts[1];

    beforeEach(async () => {
        harrowingToken = await HarrowingTokenContract.new({from: owner});
    });
    
    describe("Test ERC20 function", () => {
        it("gets the owner address of HarrowingToken contract", async () =>{
            let ownerContract = await harrowingToken.owner();
            assert.equal(ownerContract, owner, "owner sender address and owner contract address should be identical.")
        });
        it("gets the token name", async () => {
            let hardCodeName = "Harrowing Token";
            const actual = await harrowingToken.name();            
            assert.equal(actual, hardCodeName, "names should match");
        });
        it("gets the token symbol", async () => {
            let hardCodeSymbol = "HART";
            const actual = await harrowingToken.symbol();            
            assert.equal(actual, hardCodeSymbol, "symbols should match");
        });
        it("gets the token totalSupply", async () => {
            const actualTotalSupply = toBigNumber(await harrowingToken.totalSupply()).toString();
            const balanceOwner = toBigNumber(await harrowingToken.balanceOf(owner)).toString();
            assert.notEqual(balanceOwner, 0, "The owner blance should be more than zero.")
            assert.notEqual(actualTotalSupply, 0, "The HarrowingToken total supply should be more than zero.");
            assert.equal(actualTotalSupply, balanceOwner, "totalSypply should be the same as owner balance");
        });
        it("try mint some amount of token", async () => {
            const mintAmount = toBigNumber(10 * Math.pow(10, 18));
            let balanceOwnerBefore = toBigNumber(await harrowingToken.balanceOf(owner));
            await harrowingToken.mint(mintAmount, { from: owner });
            let balanceOwnerAfter = toBigNumber(await harrowingToken.balanceOf(owner)).toString();
            assert.equal(balanceOwnerAfter, balanceOwnerBefore.plus(mintAmount).toString(), "The balanceOwnerAfter == balanceOwnertBefore + mintAmount.");
        });
        it("try mint zero amount of token", async () => {
            try {
                await harrowingToken.mint(0, { from: owner });
                assert.fail("The amount should be equal (zero || < zero)");
            }
            catch (err) {
                const expectedError = "The mint _amount should be more then zero.";
                const actualError = err.reason;
                assert.equal(actualError, expectedError, "should not be permitted");
            }
        });
        it("try mint amount by Visitor", async () => {
            const mintAmount = toBigNumber(10 * Math.pow(10, 18));
            let balanceVisitorBefore = toBigNumber(await harrowingToken.balanceOf(user1)).toString();

            assert.equal(balanceVisitorBefore, 0, "The Visitor balance equal zero.");
            try {
                await harrowingToken.mint(mintAmount, { from: user1 });
                assert.fail("withdraw was not restricted to owners");
            }
            catch (err) {
                const expectedError = "Ownable: caller is not the owner";
                const actualError = err.reason;
                assert.equal(actualError, expectedError, "should not be permitted");
            } 
        });
    });
});