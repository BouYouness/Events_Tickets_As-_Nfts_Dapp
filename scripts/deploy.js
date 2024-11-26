const hre = require("hardhat");
const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
  };
  
  async function main() {
    // Setup accounts & variables
    const [deployer] = await ethers.getSigners()
    const NAME = "NftToken"
    const SYMBOL = "NT"
  
    // Deploy contract
    const NftToken = await ethers.getContractFactory("NftToken")
    const nftToken = await NftToken.deploy(NAME, SYMBOL)
    
  
    console.log(`Deployed nftToken Contract at: ${nftToken.address}\n`)
  
    // List 6 events
    const occasions = [
      {
        name: "Opening Match World Cup 2026",
        cost: tokens(1),
        tickets: 125,
        date: "June 11 ",
        time: "6:00PM ",
        location: "The Estadio Azteca, Mexico"
      },
      {
        name: "New York International Auto Show",
        cost: tokens(1),
        tickets: 125,
        date: "Mar 29",
        time: "7:00PM ",
        location: "Madison Square Garden"
      },
      {
        name: "Final World Cup",
        cost: tokens(3),
        tickets: 0,
        date: "Dec 6",
        time: "8:00PM ",
        location: "Lusail Stadium, qatar"
      },
      {
        name: "Japanese Grand Prix",
        cost: tokens(5),
        tickets: 0,
        date: "Apr 4",
        time: "2:30PM ",
        location: "Suzuka Circuit, Japon"
      },
      {
        name: "ETH Global Toronto",
        cost: tokens(1.5),
        tickets: 125,
        date: "Jun 23",
        time: "11:00AM EST",
        location: "Toronto, Canada"
      }
    ]
  
    for (var i = 0; i < 5; i++) {
      const transaction = await nftToken.connect(deployer).list(
        occasions[i].name,
        occasions[i].cost,
        occasions[i].tickets,
        occasions[i].date,
        occasions[i].time,
        occasions[i].location,
      )
  
      await transaction.wait()
  
      console.log(`Listed Event ${i + 1}: ${occasions[i].name}`)
    }
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });