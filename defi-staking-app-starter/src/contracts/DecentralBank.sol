pragma solidity ^0.5.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;


    constructor (RWD _rwd,Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    //staking function
    function depositTokens(uint _amount) public {
        //require staking amount to be greater than zero
        require(_amount > 0, 'amount cannot be 0');
        //transfer tether tokens to this contract address for staking
        tether.transferFrom(msg.sender, address(this), _amount);
        //update staking balance
        stakingBalance[msg.sender] += _amount;
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        //update staking balance
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    //unstaking function
    function unstakeTokens() public {   
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, 'staking balance cannot be less than zero');
        //transfer the tokens to the specified contract address from our bank
        tether.transfer(msg.sender, balance);
        //reset staking balance
        stakingBalance[msg.sender] = 0;
        //update staking status
        isStaking[msg.sender] = false;
    }

    //issue rewards
    function issueTokens() public {
        require(msg.sender == owner, 'The caller must be the owner');
        //cycles through the stakers of the array and issues the appropriate reward for staking
        for (uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 9; ///9 to create percentage incentive for stakers
            if(balance > 0){
                rwd.transfer(recipient, balance);
            }
        }
    }
}