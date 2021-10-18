import React, {Component} from 'react'

class Navbar extends Component {
    //our react codes goes in here
    render() {
        return (
            <nav className = 'navbar navbar-dark fixed-top shadow p-0' style = {{backgroundColor: 'black', height: '50px'}}>
                <a style = {{color: 'white'}}>DAPP Yield Staking (Decentralised Banking)</a> 
                    <ul>
                        <li>
                            <small style = {{color: 'white'}}>Account Number
                            </small>
                        </li>
                    </ul>
            </nav>
        )  
    }
}
//hey there this is where it exports
export default Navbar;