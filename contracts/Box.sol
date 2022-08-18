//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Box is Ownable {
    uint256 private Value;

    event ValueChanged(uint256 newValue);

    function store(uint256 newValue) public onlyOwner {
        Value = newValue;
        emit ValueChanged(newValue);
    }

    function retrieve() public view returns (uint256) {
        return Value;
    }
}
