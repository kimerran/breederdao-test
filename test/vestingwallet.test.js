const { ethers } = require("hardhat");

let account1, account2;

let vestingContract, token20Contract;

beforeEach(async() => {
    [account1, account2]= await ethers.getSigners();
})

describe("Vesting Wallet", async() => {
    it('1', async () => {
        const blockNumBefore = await ethers.provider.getBlockNumber();
        const blockBefore = await ethers.provider.getBlock(blockNumBefore);
        const timestampBefore = blockBefore.timestamp;
        const startDate = timestampBefore + (0);
        const durationSec = 60;

        const VestingWalletMod = await ethers.getContractFactory("VestingWalletMod");
        const Token20 = await ethers.getContractFactory("Token20");

        vestingContract = await VestingWalletMod.deploy(account2.address, startDate , durationSec)
        token20Contract = await Token20.deploy()

        await vestingContract.deployed()
        await token20Contract.deployed()

        // transfer token
        await token20Contract.transfer(vestingContract.address, 100)

        await network.provider.send("evm_increaseTime",[durationSec])
        await ethers.provider.send('evm_mine');

        const x = await vestingContract["release(address)"](token20Contract.address)
        await x.wait()

        const balanceBeneficiary =await  token20Contract.balanceOf(account2.address)
        const balVestingContract =await  token20Contract.balanceOf(vestingContract.address)
        console.log('balanceBeneficiary', balanceBeneficiary)
        console.log('balVestingContract', balVestingContract)

        // 2nd attempt (should not proceed with transfer)
        const y = await vestingContract["release(address)"](token20Contract.address)
        await y.wait()

        const balanceBeneficiary2 =await  token20Contract.balanceOf(account2.address)
        const balVestingContract2 =await  token20Contract.balanceOf(vestingContract.address)
        console.log('balanceBeneficiary2', balanceBeneficiary2)
        console.log('balVestingContract2', balVestingContract2)

    })
})