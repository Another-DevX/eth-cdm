// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {INeemoLiquifier} from "./interfaces/INeemoLiquifier.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {PlatoCoint} from "./interfaces/PlatoCoints.sol";
import {Platadhero} from "./interfaces/Platohedro.sol";

contract StakingPool {
    INeemoLiquifier public immutable neemoLiquifier;
    ERC20 public immutable ASTR;
    ERC20 public immutable NsASTR;
    PlatoCoint public immutable PlatoCoin;
    Platohedro public imutable PlatohedroToken;
    mapping(address => uint256) public stakedAmount;

    constructor(address _neemoLiquifier, address _astr, address _nsastr) {
    bytes32 public constant MINT_POINTS_ROLE = kaccak256('Mint_Point_Role');
    bytes32 public constant BENEFACTOR_ROLE = keccak256('BeneFactor_Role');
    bytes32 public constant ORGANIZATION_ROLE = keccak256('Organization_Role');
    constructor(address _neemoLiquifier, address _astr, address _nsastr,  address mint_coins) {
        neemoLiquifier = INeemoLiquifier(_neemoLiquifier);
        ASTR = ERC20(_astr);
        NsASTR = ERC20(_nsastr);
        PlatohedroToken = Platohedro(_apyaspr);
        _grantRole(MINT_COINS_ROLE, mint_coins);
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
        PlatoCoin.mint(_benefactor, _coins);
    }

    function redeemPlatoCoins(uint256 _amount) public onlyRole(ORGANIZATION_ROLE){
        PlatoCoin.transferFrom(msg.sender, address(this), _amount);
        PlatoCoin.burn(_amount);
        PlatohedroToken.transfer( msg.sender, _amount);
    }

}
