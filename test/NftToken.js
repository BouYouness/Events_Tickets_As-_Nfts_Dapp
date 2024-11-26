const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "NftToken";
const SYMBOL = "NT";

const OCCASION_NAME = "ETH Texas";
const OCCASION_COST = ethers.parseUnits('1', 'ether');
const OCCASION_MAX_TICKETS = 100;
const OCCASION_DATE = "Apr 27";
const OCCASION_TIME = "10:00AM CST";
const OCCASION_LOCATION = "Austin, Texas";

describe("NftToken", () => {

    let NftToken;
    let deployer, buyer;

    beforeEach(async () => {
        // Setup accounts
        [deployer, buyer] = await ethers.getSigners();

        const NftToken = await ethers.getContractFactory("NftToken");
        nftToken = await NftToken.deploy(NAME, SYMBOL);

        const transaction = await nftToken.connect(deployer).list(
            OCCASION_NAME,
            OCCASION_COST,
            OCCASION_MAX_TICKETS,
            OCCASION_DATE,
            OCCASION_TIME,
            OCCASION_LOCATION
        );

        await transaction.wait();
    });

    describe("Deployment", () => {
        it("Sets the name", async () => {
            expect(await nftToken.name()).to.equal(NAME);
        });

        it("Sets the symbol", async () => {
            expect(await nftToken.symbol()).to.equal(SYMBOL);
        });

        it("Sets the owner", async () => {
            expect(await nftToken.owner()).to.equal(deployer.address);
        });
    });

    describe("Occasions", () => {
        it("Updates occasions count", async () => {
            const totalOccasions = await nftToken.totalOccasions();
            expect(totalOccasions).to.be.equal(1);
        });
    });

    describe("Minting", () => {
        const ID = 1; // First occasion
        const SEAT = 50;
        const AMOUNT = ethers.parseUnits('1', 'ether');

        beforeEach(async () => {
            const transaction = await nftToken.connect(buyer).mint(ID, SEAT, { value: AMOUNT });
            await transaction.wait();
        });

        it("Updates ticket count", async () => {
            const occasion = await nftToken.getOccasion(1);
            expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS - 1);
        });

        it("Updates buying status", async () => {
            const status = await nftToken.hasBought(ID, buyer.address);
            expect(status).to.be.equal(true);
        });

        it("Updates the seat status", async () => {
            const owner = await nftToken(ID, SEAT);
            expect(owner).to.be.equal(buyer.address);
        });

        it("Updates overall seating status", async () => {
            const seats = await nftToken.getSeatsTaken(ID);
            expect(seats.length).to.equal(1);
            expect(seats[0]).to.equal(SEAT);
        });

        it("Contract balance", async () => {
            const balance = await ethers.provider.getBalance(nftToken.address);
            expect(balance).to.be.equal(AMOUNT);
        });
    });
});

