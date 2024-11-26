// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NftToken is ERC721 {
    address public owner;
    uint256 public totalOccasions;
    uint256 public totalSupply; //total supply of minted tickets

    struct Occasion {
       uint256 id;
       string name;
       uint256 cost;
       uint256 tickets;
       uint256 maxTickets;
       string date;
       string time;
       string location;
    }

    modifier onlyOwner(){
      require(msg.sender == owner);
      _;
    }

    mapping(uint256 => Occasion) public occasions;
    mapping(uint256 occasionId =>mapping(address bayer => bool)) public hasBought;
    mapping(uint256 occasionId => mapping(uint256 seatNumber => address seatOwner)) public seatTaken;
    mapping(uint256 occasionId => uint256[] _seatsTaken) public seatsTaken;

    constructor(string memory _name, string memory _symbol) ERC721(_name , _symbol){
      
      owner =msg.sender;
    }

    function list(
      string memory _name,
      uint256 _cost,
      uint256 _maxTickets,
      string memory _date,
      string memory _time,
      string memory _location) public onlyOwner {

     totalOccasions++; 
     
     occasions[totalOccasions] = Occasion(
        totalOccasions,
        _name,
        _cost,
        _maxTickets,
        _maxTickets,
        _date,
        _time,
        _location
     );

    }

    function mint(uint256 _occasionId, uint256 _seatNumber) public payable{
      // making sure passing a valid totalOccasions
      require(_occasionId > 0 && _occasionId <= totalOccasions);

      // making sure senting a valid cost
      require(msg.value >= occasions[_occasionId].cost );
      require(_seatNumber <= occasions[_occasionId].maxTickets);

      //making sure that the seat is not taking and exists
      require(seatTaken[_occasionId][_seatNumber] == address(0));

      occasions[_occasionId].tickets -= 1; //update ticket count

      hasBought[_occasionId][msg.sender]= true;

      seatTaken[_occasionId][_seatNumber] = msg.sender; // seat taked by the caller

      seatsTaken[_occasionId].push(_seatNumber);

      totalSupply++;

      _safeMint(msg.sender, totalSupply);  
    }

    function getOccasion(uint256 _id) public view returns(Occasion memory){
      return occasions[_id];
    }

    function getSeatsTaken(uint256 _id /* occasion id*/) public view returns(uint256[] memory){
      return seatsTaken[_id];
    }

    function withdraw() public onlyOwner() {
      (bool success, ) = owner.call{value : address(this).balance}("");
      require(success);
    }
  
}