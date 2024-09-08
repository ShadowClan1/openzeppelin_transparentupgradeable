// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Utils.sol";

import "hardhat/console.sol";
 
contract Proxy is TransparentUpgradeableProxy {
    constructor(
        address _impelementation,
        address _admin,
        bytes memory _data
    ) TransparentUpgradeableProxy(_impelementation, _admin, _data) {}


    function getProxyAdminAddress() public view returns (address) {
     return ERC1967Utils.getAdmin();
    }

    receive() external payable {}
}

contract L1 is Initializable {
    string public val;

    function setValue() external returns (bool) {
        val = "hare krishna";
        return true;
    }

    function initialize() public initializer {
        val = "hare krishnaa a";
    }
}

contract L2 is Initializable {
    string public val;

    function setValue(string memory _val) external returns (bool) {
        val = _val;
        return true;
    }

    function initialize() public initializer {
        val = "hare Ram";
    }
}
