// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract MagicNum {
    address public solver;

    constructor() {}

    function setSolver(address _solver) public {
        solver = _solver;
    }

    // the following code has been added by me
    function validate() public returns (bool) {
        (bool success, bytes memory magic) = solver.call("");
        if (keccak256(magic) != keccak256(abi.encodePacked(uint(42)))) {
            success = false;
        }

        // require the solver to have at most 10 opcodes
        uint256 size;
        assembly {
            size := extcodesize(solver.slot)
        }
        if (size > 10) {
            success = false;
        }
        return success;
    }

    /*
    ____________/\\\_______/\\\\\\\\\_____        
    __________/\\\\\_____/\\\///////\\\___       
    ________/\\\/\\\____\///______\//\\\__      
    ______/\\\/\/\\\______________/\\\/___     
    ____/\\\/__\/\\\___________/\\\//_____    
    __/\\\\\\\\\\\\\\\\_____/\\\//________   
    _\///////////\\\//____/\\\/___________  
    ___________\/\\\_____/\\\\\\\\\\\\\\\_ 
    ___________\///_____\///////////////__
    */
}
