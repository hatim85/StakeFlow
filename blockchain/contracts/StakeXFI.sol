// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StakeXFI is ERC20 {
    constructor() ERC20("StakeXFI", "stXFI") {}

    mapping(address => uint256) public lastWithdraw;

    function transferToken() public {
        uint256 amount = 100 * 10**18;
        require(
            balanceOf(address(this)) >= amount,
            "Not enough tokens in contract"
        );
        _transfer(address(this), msg.sender, amount);
        lastWithdraw[msg.sender] = block.timestamp;
    }

    function mint(address account, uint256 amount) external  {
        _mint(account, amount); // Mint new tokens to the account
    }

    function burn(address account, uint256 amount) external  {
        _burn(account, amount); // Burn tokens from the account
    }
}
