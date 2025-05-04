// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {StakingPool} from "../src/StakingPool.sol";
import {PlatoCoin} from "../src/PlatoCoin.sol";
import {ASTRMock} from "../src/ASTRMock.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StakingPoolScript is Script {
    StakingPool public stakingPool;
    ERC20 public ASTR;
    ERC20 public _NsASTR;
    PlatoCoin public platoCoin;
    ASTRMock public _ASTRMock;

    function run() public {
        platoCoin = new PlatoCoin();
        _ASTRMock = new ASTRMock();

        address minter = msg.sender;

        vm.startBroadcast();
        stakingPool = new StakingPool(
            address(0xB51B97050CeA88C20a93E1d72de8a314e47bAEC5),
            address(0x2CAE934a1e84F693fbb78CA5ED3B0A6893259441),
            address(0xc67476893C166c537afd9bc6bc87b3f228b44337),
            address(platoCoin),
            address(_ASTRMock),
            minter
        );

        console.log("PlatoCoin deployed at:", address(platoCoin));
        console.log("ASTRMock deployed at:", address(_ASTRMock));
        console.log("StakingPool deployed at:", address(stakingPool));

        vm.stopBroadcast();
    }
}
