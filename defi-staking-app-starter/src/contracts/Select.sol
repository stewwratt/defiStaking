pragma solidity ^0.5.0;

contract Select {
    string public standard = 'Token 0.1';
    string public name = 'Select Token';
    string public symbol = 'SLT';
    uint256 public totalSupply = 500000000000000000000000;
    uint8 public decimal = 18;
    uint public tokenBurnRate = 20;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    constructor () public {
        balanceOf[msg.sender] = totalSupply;
    }

    function Transfer(address _to, uint _value) public returns (bool success){
        require(_value <= balanceOf[msg.sender]);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit transfer(msg.sender, _to, _value);
        return true;
    }

    function Approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success){
        require(balanceOf[_from] >= _value);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[msg.sender][_from] -= _value;
        emit transfer(_from, _to, _value);
        return true;

    }

}