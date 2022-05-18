pragma solidity 0.8.4;

import "@openzeppelin/contracts/finance/VestingWallet.sol";
import "hardhat/console.sol";

contract VestingWalletMod is VestingWallet {
    uint64 contractTs;
    uint64 contractDuration;
    uint64 periodDuration = 100 seconds;
    uint64 periods = 2;
    uint64 nextPayout;

    constructor(address beneficiary, uint64 startTimeStamp, uint64 duration) VestingWallet(beneficiary, startTimeStamp, duration) {
        contractTs = startTimeStamp;
        contractDuration = duration;

        console.log('startTimeStamp', startTimeStamp);
        console.log('duration', duration);

        nextPayout = startTimeStamp + duration;
        console.log('nextPayout', nextPayout);
    }

    function release(address token) public override {
        uint256 totalAllocation = IERC20(token).balanceOf(address(this));
        uint periodPayout = totalAllocation / periods;

        uint256 timestamp = block.timestamp;
        console.log('release timestamp', timestamp);
        console.log('release nextPayout', nextPayout);

        if (timestamp > nextPayout) {
            SafeERC20.safeTransfer(IERC20(token), beneficiary(), periodPayout);
            nextPayout += periodDuration;
            periods--;
        }
        console.log('release nextPayout updated', nextPayout);

    }
}