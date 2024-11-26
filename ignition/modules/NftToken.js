// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const NAME = "NftToken"
const SYMBOL = "NT"


module.exports = buildModule("NftTokenModule", (m) => {
 
  const nftToken = m.contract("NftToken", [NAME,SYMBOL ]
  );

  return { nftToken };
});
