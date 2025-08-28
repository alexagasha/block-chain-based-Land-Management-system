// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandRegistry {
    // Struct to store user details
    struct User {
        string username;
        bytes32 passwordHash;
        address userAddress;
    }

    // Struct to store land details
    struct Land {
        uint256 landId;
        string ownerName;
        string location;
        uint256 area;
        string nin;
        address owner;
    }

    // State variables
    uint256 public landCount;
    mapping(address => User) public users;
    mapping(uint256 => Land) public lands;

    // Events
    event LandRegistered(
        uint256 indexed landId,
        string ownerName,
        string location,
        uint256 area,
        string nin,
        address indexed owner
    );
    event OwnershipTransferred(
        uint256 indexed landId,
        address indexed previousOwner,
        address indexed newOwner
    );

    // Get user details
    function getUser(address userAddress)
        public
        view
        returns (string memory, bytes32, address)
    {
        User memory user = users[userAddress];
        require(bytes(user.username).length > 0, "User not found");
        return (user.username, user.passwordHash, user.userAddress);
    }

    // Register a new land
    function registerLand(
        string memory _ownerName,
        string memory _location,
        uint256 _area,
        string memory _nin
    ) public {
        require(bytes(_ownerName).length > 0, "Owner name cannot be empty");
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(_area > 0, "Area must be greater than zero");
        require(bytes(_nin).length > 0, "NIN cannot be empty");

        landCount++;
        lands[landCount] = Land(
            landCount,
            _ownerName,
            _location,
            _area,
            _nin,
            msg.sender
        );
        emit LandRegistered(
            landCount,
            _ownerName,
            _location,
            _area,
            _nin,
            msg.sender
        );
    }

    // Get land details by ID
    function getLand(uint256 _landId)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            string memory,
            address
        )
    {
        require(_landId > 0 && _landId <= landCount, "Land not found");
        Land memory land = lands[_landId];
        return (
            land.ownerName,
            land.location,
            land.area,
            land.nin,
            land.owner
        );
    }

    // Get all lands
    function getAllLands() public view returns (Land[] memory) {
        Land[] memory allLands = new Land[](landCount);
        for (uint256 i = 1; i <= landCount; i++) {
            allLands[i - 1] = lands[i];
        }
        return allLands;
    }

    // Transfer ownership of the land
    function transferOwnership(uint256 _landId, address _newOwner) public {
        require(_landId > 0 && _landId <= landCount, "Land not found");
        require(_newOwner != address(0), "New owner cannot be the zero address");

        Land storage land = lands[_landId];
        require(land.owner == msg.sender, "You are not the owner of this land");

        address previousOwner = land.owner;
        land.owner = _newOwner;

        emit OwnershipTransferred(_landId, previousOwner, _newOwner);
    }
}
