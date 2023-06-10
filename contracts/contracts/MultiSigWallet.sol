// SPDX-License-Identifier: TODO

pragma solidity ^0.8.19;

contract MultiSigWallet {
    address[] public owners;
    mapping(address => bool) public isOwner;
    uint public nConfirmations;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

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

    constructor(address[] memory _owners, uint numConfirmationsRequired) {
        require(owners.length > 0, "owners required");
        require(
            numConfirmationsRequired > 0 &&
                numConfirmationsRequired <= owners.length,
            "invalid number of required confirmations"
        );

        for (uint i = 0; i < owners.length; i++) {
            address owner = owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
        }

        owners = _owners;
        nConfirmations = numConfirmationsRequired;
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

    function getOwners() public view returns (address[] memory) {
        return owners;
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
}
