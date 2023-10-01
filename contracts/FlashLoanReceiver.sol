// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./FlashLoan.sol";
import"./Token.sol";

contract FlashLoanReceiver {
    FlashLoan private pool;
    address private owner;

    constructor(address _poolAddress) {
        pool = FlashLoan(_poolAddress);
        owner = msg.sender;
    }


function  receiveToken(address _tokenAddress,uint256 _amount)external {
    //Do Stuff the Money
    console.log("_tokenAddress",_tokenAddress,"_amount",_amount);

    
    
}
    function excuteFlashLoan(uint _amount) external {
        require(msg.sender==owner,"ONly Owner can send The MOney or Guve to the Acess");
        pool.flashLoan(_amount);
    }
}
