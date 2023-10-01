// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IRceiver {
    function receiveTokens(address tokenAddress, uint256 amount) external;
}

contract FlashLoan {
    using SafeMath for uint256;
    Token public token;

    uint256 public poolBalance;

    constructor(address _tokenAddress) {
        token = Token(_tokenAddress);
    }

    function depositeToken(uint256 _amount) external {
        require(_amount > 0, "Funds Must be Greater Then 0");

        token.transferFrom(msg.sender, address(this), _amount);
        poolBalance = poolBalance.add(_amount);
    }

    function flashLoan(uint _borrowAmount) external {
        //send token to the Receiver and get paid nback and ensure that Loan is PAID BACK
        token.transfer(msg.sender, _borrowAmount);
        IRceiver(msg.sender).receiveTokens(address(token), _borrowAmount);
    }
}
