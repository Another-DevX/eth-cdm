// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {INemoLiquifier} from "./interfaces/INemoLiquifier.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StakingPool {
    INemoLiquifier public immutable nemoLiquifier;
    ERC20 public immutable ASTR;
    ERC20 public immutable NsASTR;
    mapping(address => uint256) public stakedAmount;

    constructor(address _nemoLiquifier, address _astr, address _nsastr) {
        nemoLiquifier = INemoLiquifier(_nemoLiquifier);
        ASTR = ERC20(_astr);
        NsASTR = ERC20(_nsastr);
    }

    function stake(uint256 amount) public {
        ASTR.transferFrom(msg.sender, address(this), amount);
        ASTR.approve(address(nemoLiquifier), amount);
        nemoLiquifier.swapUnderlyingToLst(amount, address(this), address(0));
        stakedAmount[msg.sender] += amount;
    }

    function unstake(uint256 amount) public {
        //TODO: Implement unstake
    }

    function withdraw(uint256 amount) public {
        //TODO: Implement withdraw
    }

    
}
