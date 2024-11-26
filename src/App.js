import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Sort from './components/Sort';
import Card from './components/Card';
import SeatChart from './components/SeatChart';

//ABI
import {contractABI} from "./AddressABI/contractABI";
//Contract Adress
import { contractAddress } from "./AddressABI/contractAddress";


function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);  

  const [nftToken, setNftToken] = useState(null);
  const [occasions, setOccasions] = useState([]);

  const [occasion, setOccasion] = useState({});
  const [toggle, setToggle] = useState(false);
  
  
  const loadBlockchainData = async () => {
    //Fetch Account
    /*const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    const account = ethers.utils.getAddress([accounts[0]]);   
    setAccount(account);*/

    //provider: it's the new blockchain connection it provides the blockchian connection so you can sighn transaction with metamask...
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    console.log(network);

    const nftToken = new ethers.Contract(contractAddress, contractABI, provider );
    setNftToken(nftToken);

    const totalOccasions = await nftToken.totalOccasions();
    const occasions = [];

    for (let i =1; i <= totalOccasions; i++){
      const occasion = await nftToken.getOccasion(i);
      occasions.push(occasion);
    }

    setOccasions(occasions);
    console.log(occasions);
    

    //Refresh Account
    window.ethereum.on('accountsChanged', async() => {
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const account = ethers.utils.getAddress([accounts[0]]);   
      setAccount(account);
    });
    
  };

  useEffect(() => {
    loadBlockchainData();
  },[]);

  return (
    <div>

      <header>
       <Navigation account={account} setAccount={setAccount}/>

        <h2 className='header__title'><strong>Event</strong>Tickets</h2>
      </header>

      <Sort/>

      <div className='cards'>
        {occasions.map((occasion, index) => (
          <Card
          occasion={occasion}
          id={index + 1}
          nftToken={nftToken}
          provider={provider}
          account={account}
          toggle={toggle}
          setToggle={setToggle}
          setOccasion={setOccasion}
          key={index}

        />

        ))};

      </div>

      {toggle && (
        <SeatChart
        occasion={occasion}
        nftToken={nftToken}
        provider={provider}
        setToggle={setToggle}
        />
      )}


    </div>
  );
}

export default App;
