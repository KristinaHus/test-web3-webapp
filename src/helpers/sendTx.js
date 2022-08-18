import Web3 from 'web3'

export const sendTx = async (address, to, amount) => {
  console.log('Address', address)
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
  const nonce = await web3.eth.getTransactionCount(address, 'latest'); // nonce starts counting from 0
  const gas = await web3.eth.getGasPrice()

  console.log('gas', gas, web3.utils.fromWei(gas))

  const transaction = {
    'from': address,
    'to': to,
    'value': web3.utils.toWei(amount),
    'gasPrice': gas,
    'nonce': nonce,
    // optional data field to send message or execute smart contract
  };

  web3.eth.sendTransaction(transaction, function(error, hash) {
    if (!error) {
      console.log("🎉 The hash of your transaction is: ", hash, "\n Check Polygonscan to view the status of your transaction!");
    } else {
      console.log("❗Something went wrong while submitting your transaction:", error)
    }
  });
}
