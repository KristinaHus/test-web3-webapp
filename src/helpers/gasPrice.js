const Web3 = require('web3');
const axios = require('axios');

export const gasPrice = async () => {
  // Sometimes Polygon network (or the provider) returns a bad gas price of 2.5
  // Do some extra calculations
  let gp = 60000000000;
  const web3 = new Web3('https://polygon-mainnet.infura.io/v3/dee647015b714f2d93421aa2fbc9f9fd');

  try {
    gp = await web3.eth.getGasPrice();
    const gpGWei = Number(gp) / 1000000000;

    if ((gpGWei >= 2.4) && (gpGWei <= 2.6)) {
      console.log('Recalculating gas price:', gpGWei);

      const response = await axios.get('https://gasstation-mainnet.matic.network/v2');
      const data = response.data;
      const standard = data.standard;
      const fee = standard.maxFee;

      gp = fee * 1000000000;
    }
  } catch(error) {
    console.log(error);
    // If there's any error, try sending the tx with 60 GWEI
    gp = 60000000000;
  }

  return gp;
}
