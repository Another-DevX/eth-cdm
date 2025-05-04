// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/interfaces/PlatoCoin.sol";
import "../src/interfaces/INeemoLiquifier.sol";

abstract contract INeeMoliquifier {
    address constant IMPORTANT_ADDRESS = 0x543d...;
    SomeContract someContract;
    constructor() {...}
}


import {Test, console} from "forge-std/Test.sol";
import {StakingPool}     from "../src/StakingPool.sol";


contract StakingPoolTest is Test {

    StakingPool public stakingPool;
    PlatoCoin public ASTR;
    PlatoCoin public NsASTR;
    PlatoCoin public ASTRMockToken;
    INeemoLiquifier public neemoLiquifier;


    address public minter_coins_rol = address(this);  
    address public staker = address(1);       
    address public benefactor = address(2);
    address public sponsor = address(3);

    function beforeEach() public {
        
        neemoLiquifier = new INeemoLiquifier();
        ASTR = new PlatoCoin("ASTR", "ASTR", 18);
        NsASTR = new PlatoCoin("NsASTR", "NsASTR", 18);
        PlatoCoin = new PlatoCoin("PLATO", "PLT", 18);
        ASTRMockToken = new PlatoCoin("PLH", "PLH", 18);

        stakingPool = new StakingPool(
            address(neemoLiquifier),
            address(ASTR),
            address(NsASTR),
            address(PlatoCoin),
            address(ASTRMockToken),
            minter_coins_rol
        );
    }

    function testStake() public {
        ASTR.transferFrom(address(NsASTR), address(ASTR), 500 ether)
        ASTR.approve(address(stakingPool), 500 ether);

        stakingPool.stake(500 ether);

        assertEq(stakingPool.stakedAmount(staker), 500 ether);

    }
    function testGivePlatoCoinsToBenefactor() public {
        stakingPool.givePlatoCoinsToBenefactor(1000 ether, benefactor);
        assertEq(PlatoCoin.balanceOf(benefactor), 1000 ether);
    }
    function testRedeemPlatoCoins() public {
        Platocoin.transferFrom(msg.sender, sponsor)
        Platocoin.burn(500 ether)
        ASTRMockToken.transfer(msg.sender, 500 ether)

        stakingPool.redeemPlatoCoins(500 ether)
        assertEq(PlatoCoin.balanceOf(sponsor), 500 ether)
    }
}


        