// SPDX-License-Identifier: TODO

pragma solidity ^0.8.19;

struct Signature {
    uint8 v;
    bytes32 r;
    bytes32 s;
}

contract KYC {

    address private signerAddress;

    mapping(address => bool) public isKYCed;

    constructor(address _signerAddress) {
        signerAddress = _signerAddress;
    }

    function setKYC(Signature calldata signature) external {
        bytes32 h = keccak256(abi.encode(msg.sender));
        address signer = ecrecover(h, signature.v, signature.r, signature.s);
        require(signer == signerAddress, "not signed by signer");
        isKYCed[msg.sender] = true;
    }

    function isKYC(address addr) external view returns (bool) {
        return isKYCed[addr];
    }

}