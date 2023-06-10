// SPDX-License-Identifier: TODO

pragma solidity ^0.8.19;

import "./Ownable.sol";

struct Signature {
    uint8 v;
    bytes32 r;
    bytes32 s;
}

contract KYC is Ownable {
    address private signerAddress;

    mapping(address => bool) public isKYCed;

    event SignerChanged(
        address indexed previousSigner,
        address indexed newSigner
    );

    modifier onlyKYCed(address addr) {
        require(isKYCed[addr], "not KYCed");
        _;
    }

    modifier onlySigner() {
        require(msg.sender == signerAddress);
        _;
    }

    constructor(address _signerAddress) {
        signerAddress = _signerAddress;
    }

    function setKYC(Signature calldata signature) external {
        bytes32 h = keccak256(abi.encode(msg.sender));
        address signer = ecrecover(h, signature.v, signature.r, signature.s);
        require(signer == signerAddress, "not signed by signer");
        isKYCed[msg.sender] = true;
    }

    function getKYC(address addr) external view returns (bool) {
        return isKYCed[addr];
    }

    function revokeKYC(address addr) external onlySigner {
        delete isKYCed[addr];
    }

    function setSignerAddress(address _signerAddress) external onlyOwner {
        emit SignerChanged(signerAddress, _signerAddress);
        signerAddress = _signerAddress;
    }
}
