// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {INeemoLiquifier} from "./interfaces/INeemoLiquifier.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StakingPool {
    INeemoLiquifier public immutable neemoLiquifier;
    ERC20 public immutable ASTR;
    ERC20 public immutable NsASTR;
    mapping(address => uint256) public stakedAmount;

    constructor(address _neemoLiquifier, address _astr, address _nsastr) {
        neemoLiquifier = INeemoLiquifier(_neemoLiquifier);
        ASTR = ERC20(_astr);
        NsASTR = ERC20(_nsastr);
    }

    function stake(uint256 amount) public {
        ASTR.transferFrom(msg.sender, address(this), amount);
        ASTR.approve(address(neemoLiquifier), amount);
        neemoLiquifier.swapUnderlyingToLst(amount, address(this), address(0));
        stakedAmount[msg.sender] += amount;
    }

    function unstake(uint256 amount) public {
        // neemoLiquifier.swapLstToUnderlying(amount, address(this), address(0));
        // NsASTR.transfer(msg.sender, amount);
        // stakedAmount[msg.sender] -= amount;
    }

    function withdraw(uint256 amount) public {
        // ASTR.transfer(msg.sender, amount);
    }


}
