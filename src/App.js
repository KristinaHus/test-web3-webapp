import { useEffect, useState } from 'react'
import Web3 from 'web3';

import Web3Img from './assets/web3-color-logo-512x512.png'
import './App.css';

//3
import abi from './abis/min.json'
import { RUUF, USDC, WETH } from './constants/coins'
import { sendTx } from './helpers/sendTx'
const coins = [{ symbol: 'RUUF', address: RUUF }, { symbol: 'USDC', address: USDC }, { symbol: 'WETH', address: WETH }]

function App() {
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');

  const [account, setAccount] = useState()
  //2
  const [balance, setBalance] = useState()
  //3
  const [balances, setBalances] = useState([])
  // 4
  const [isSend, setIsSend] = useState(false)
  const [address, setAddress] = useState()
  const [amount, setAmount] = useState()


  const load = async () => {
    const accounts = await web3.eth.requestAccounts();
    console.log('accounts', accounts)

    // Get chain/network id
    // const chainId = await web3.eth.getChainId();
    // console.log('chainId', chainId);

    // const nodeInfo = await web3.eth.getNodeInfo();
    // console.log('nodeInfo', nodeInfo);

    setAccount(accounts[0]);
  }

  // 2 Get native balance
  useEffect(() => {
    if (account) {
      getBalance()
    }
  }, [account])
  const getBalance = async () => {
    console.log('account', account)
    const accountBalance = await web3.eth.getBalance(account)
    console.log('accountBalance', accountBalance)
    setBalance(web3.utils.fromWei(accountBalance))
  }

  // 3
  const getBalances = async () => {
    const currentBalances = []
    for (let i = 0; i < coins.length; i++) {
      const RUUFContract = new web3.eth.Contract(abi, coins[i].address)
      console.log('RUUFContract', RUUFContract)
      const result = await RUUFContract.methods.balanceOf(account).call();
      console.log('result', result)
      const format = web3.utils.fromWei(result); // 29803630.997051883414242659
      console.log('format', format)
      currentBalances.push({ symbol: coins[i].symbol, balance: format })
    }
    setBalances(currentBalances)
  }

  //4
  const handleSandClick = () => {
    setIsSend(state => !state)
  }
  const handleAddress = (event) => {
    setAddress(event.target.value)
  }
  const handleAmount = (event) => {
    setAmount(event.target.value)
  }
  const confirmSend = async () => {
    await sendTx(account, address, amount)
  }

  return (
    <div className="App">
      <div className="App-header">
        <img src={Web3Img} className="App-logo" alt="logo" />
        {account
          ? <div>
            {isSend
              ? <div className="section">
                <div className="row">
                  <p>Address: </p>
                  <input type="text" className="input" onChange={handleAddress}/>
                </div>
                <div className="row">
                  <p>Amount: </p>
                  <input type="text" className="input" onChange={handleAmount}/>
                </div>
                <div className="row">
                  <button className="button" onClick={confirmSend}>Send</button>
                </div>
              </div>
              : <button className="button" onClick={handleSandClick}>Send</button>
            }

            <p>Your account is: {account}</p>
            {balance
              ? <div>
                <p>Your balance: {balance} MATIC</p>
                {balances.length === 0
                  ? <button className="link" onClick={getBalances}>See more &#9660;</button>
                  : <div>
                    <p>Other coins:</p>
                    {balances.map(coinBalance => {
                      return (
                        <div className="row">
                          <p key={coinBalance.symbol}>{coinBalance.symbol}:</p>
                          <p className="offsetLeft">{coinBalance.balance}</p>
                        </div>
                      )
                    })}
                  </div>
                }
              </div>
              : null
            }
          </div>
          : <button className="button" onClick={load}>
            Connect wallet
          </button>
        }
      </div>
    </div>
  );
}

export default App;
