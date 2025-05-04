// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/PlatoCoin.sol";
import "../src/interfaces/INeemoLiquifier.sol";
import {ERC20Mock} from "./ERC20Mock.sol";
import {ASTRMock} from "../src/ASTRMock.sol";

import {Test, console} from "forge-std/Test.sol";
import {StakingPool}     from "../src/StakingPool.sol";


contract StakingPoolTest is Test {

    StakingPool public stakingPool;
    ERC20Mock public ASTR;
    ERC20Mock public NsASTR;
    PlatoCoin public platoCoin;
    ASTRMock public ASTRMockToken;
    INeemoLiquifier public neemoLiquifier;


    address public minter_coins_rol = address(this);  
    address public staker = address(1);       
    address public benefactor = address(2);
    address public sponsor = address(3);

    function setUp() public {
        
        ASTR = new ERC20Mock(1000 ether);
        NsASTR = new ERC20Mock(1000 ether);
        platoCoin = new PlatoCoin();
        ASTRMockToken = new ASTRMock();


        stakingPool = new StakingPool(
            address(77),
            address(ASTR),
            address(NsASTR),
            address(platoCoin),
            address(ASTRMockToken),
            minter_coins_rol
        );

        ASTRMockToken.mint(address(stakingPool), 1000 ether);

        vm.startPrank(minter_coins_rol);
        stakingPool.grantRole(stakingPool.ORGANIZATION_ROLE(), sponsor);
        vm.stopPrank();
}

    function testGivePlatoCoinsToBenefactor() public {
        vm.startPrank(minter_coins_rol);
        stakingPool.givePlatoCoinsToBenefactor(1000 ether, benefactor);
        vm.stopPrank();
        assertEq(platoCoin.balanceOf(benefactor), 1000 ether);
    }

    function testRedeemPlatoCoins() public {
        vm.startPrank(minter_coins_rol);
        platoCoin.mint(sponsor, 500 ether);
        vm.stopPrank();

        vm.startPrank(sponsor);
        platoCoin.approve(address(stakingPool), 500 ether);
        stakingPool.redeemPlatoCoins(500 ether);
        vm.stopPrank();
        assertEq(platoCoin.balanceOf(sponsor), 0 ether);
    }
}


        