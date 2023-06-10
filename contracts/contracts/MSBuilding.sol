// SPDX-License-Identifier: TODO

pragma solidity ^0.8.19;

import "./Building.sol";

contract MSBuilding is Building {
    uint public nConfirmations;

    struct CreateTokenRequest {
        // TODO: add fields needed to create a token.

        bool executed;
        uint nConfirmations;
    }

    // mapping from request index => owner => bool
    mapping(uint => mapping(address => bool)) public isConfirmed;

    CreateTokenRequest[] public requests;

    modifier requestExists(uint requestIndex) {
        require(requestIndex < requests.length, "request does not exist");
        _;
    }

    modifier notExecuted(uint requestIndex) {
        require(!requests[requestIndex].executed, "request already executed");
        _;
    }

    modifier notConfirmed(uint requestIndex) {
        require(
            !isConfirmed[requestIndex][msg.sender],
            "request already confirmed"
        );
        _;
    }

    constructor(
        string memory _uri,
        address _signerAddress,
        address[] memory _owners,
        address _stableCoinAddress,
        uint _numConfirmationsRequired
    ) Building(_uri, _signerAddress, _owners, _stableCoinAddress) {
        require(
            _numConfirmationsRequired > 0 &&
                _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );
        nConfirmations = _numConfirmationsRequired;
    }

    event SubmitCreateTokenRequest(
        address indexed owner,
        uint indexed requestIndex
    );

    function submitCreateTokenRequest()
        public
        // TODO
        onlyOwner
    {
        uint requestIndex = requests.length;
        requests.push(CreateTokenRequest({executed: false, nConfirmations: 0}));
        emit SubmitCreateTokenRequest(msg.sender, requestIndex);
    }

    event ConfirmCreateTokenRequest(
        address indexed owner,
        uint indexed txIndex
    );

    function confirmCreateTokenRequest(
        uint requestIndex
    )
        public
        onlyOwner
        requestExists(requestIndex)
        notExecuted(requestIndex)
        notConfirmed(requestIndex)
    {
        CreateTokenRequest storage request = requests[requestIndex];
        request.nConfirmations += 1;
        isConfirmed[requestIndex][msg.sender] = true;

        emit ConfirmCreateTokenRequest(msg.sender, requestIndex);
    }

    event ExecuteCreateTokenRequest(
        address indexed owner,
        uint indexed txIndex
    );

    function executeTransaction(
        uint requestIndex
    ) public onlyOwner requestExists(requestIndex) notExecuted(requestIndex) {
        CreateTokenRequest storage request = requests[requestIndex];

        require(
            request.nConfirmations >= nConfirmations,
            "cannot execute create token request"
        );

        request.executed = true;

        // TODO: create token.

        emit ExecuteCreateTokenRequest(msg.sender, requestIndex);
    }

    event RevokeConfirmation(address indexed owner, uint indexed txIndex);

    function revokeConfirmation(
        uint requestIndex
    ) public onlyOwner requestExists(requestIndex) notExecuted(requestIndex) {
        CreateTokenRequest storage request = requests[requestIndex];

        require(
            isConfirmed[requestIndex][msg.sender],
            "create token request not confirmed"
        );

        request.nConfirmations -= 1;
        isConfirmed[requestIndex][msg.sender] = false;

        emit RevokeConfirmation(msg.sender, requestIndex);
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }

    function getCreateTokenRequest(
        uint requestIndex
    ) public view returns (bool executed, uint numConfirmations) {
        CreateTokenRequest storage request = requests[requestIndex];

        return (request.executed, request.nConfirmations);
    }

    function mint(
        address to,
        uint256 id,
        uint256 _initialSupply,
        uint256 _initialPricePerToken,
        uint _yieldAtSale
    ) public override onlyOwner {
        // TODO!
        super.mint(to, id, _initialSupply, _initialPricePerToken, _yieldAtSale);
    }
}
