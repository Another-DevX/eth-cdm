pragma solidity ^0.8.13;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract PlatoCoint is ERC20 {
    constructor() ERC20("PlatoCoin", "PC"){
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function burn(uint256 amount) public  {
        _burn(msg.sender, amount);
    }

}