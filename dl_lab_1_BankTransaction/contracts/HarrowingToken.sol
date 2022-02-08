// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HarrowingToken is Ownable, ERC20 {    
    constructor() ERC20("Harrowing Token", "HART") Ownable() {
        require(msg.sender != address(0), "MyToken: Owner address is zero.");
        _mint(msg.sender, 10_000 * 10 ** 18);
    }

    function mint(uint256 _amount) external onlyOwner {
        require(_amount > 0, "The mint _amount should be more then zero.");
        _mint(msg.sender, _amount);
    }
}
