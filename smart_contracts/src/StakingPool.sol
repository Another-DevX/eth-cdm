// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {INeemoLiquifier} from "./interfaces/INeemoLiquifier.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {PlatoCoin} from "./PlatoCoin.sol";
import {ASTRMock} from "./ASTRMock.sol";
import {StakingPool} from "./StakingPool.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract StakingPool is AccessControl {
    INeemoLiquifier public immutable neemoLiquifier;
    ERC20 public immutable ASTR;
    ERC20 public immutable NsASTR;
    PlatoCoin public immutable platoCoin;
    ASTRMock public immutable ASTRMockToken;
    mapping(address => uint256) public stakedAmount;

    
    bytes32 public constant MINT_COINS_ROLE = keccak256('Mint_Coins_Role');
    bytes32 public constant BENEFACTOR_ROLE = keccak256('BeneFactor_Role');
    bytes32 public constant ORGANIZATION_ROLE = keccak256('Organization_Role');
   
    constructor(address _neemoLiquifier, address _astr, address _nsastr,  address _platoCoin,address _apyaspr, address minter) {
        neemoLiquifier = INeemoLiquifier(_neemoLiquifier);
        ASTR = ERC20(_astr);
        NsASTR = ERC20(_nsastr);
        platoCoin = PlatoCoin(_platoCoin);
        ASTRMockToken = ASTRMock(_apyaspr);
        _grantRole(MINT_COINS_ROLE, minter);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
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

    function givePlatoCoinsToBenefactor(uint _coins, address _benefactor) public onlyRole(MINT_COINS_ROLE) {
        platoCoin.mint(_benefactor, _coins);
    }

    function redeemPlatoCoins(uint256 _amount) public onlyRole(ORGANIZATION_ROLE){
        platoCoin.transferFrom(msg.sender, address(this), _amount);
        platoCoin.burn(_amount);
        ASTRMockToken.transfer( msg.sender, _amount);
    }

}
