pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token20 is ERC20 {
    constructor() ERC20('Token20', 'T20') {
        // totalSupply += 1000;
        _mint(msg.sender, 1000);
    }
}