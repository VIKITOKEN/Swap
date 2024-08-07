import { callReadOnlyFunction , uintCV } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';


async function fetchPoolData(id) {
  const contractAddress = 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1';
  const contractName = 'univ2-core';
  const functionName = 'do-get-pool';
  const buffer = uintCV(id);
  const network = new StacksMainnet();
  const senderAddress = 'ST2F4BK4GZH6YFBNHYDDGN4T1RKBA7DA1BJZPJEJJ';

  const options = {
    contractAddress,
    contractName,
    functionName,
    functionArgs: [buffer],
    network,
    senderAddress,
  };


  const result = await callReadOnlyFunction(options);

  const token0_reserve0 = Number(result.data.reserve0.value);
  const token1_reserve0 = Number(result.data.reserve1.value);

  // Calculate stx_odn, handling BigInt division
  const stx_odn = token1_reserve0 / token0_reserve0;

  const stx_odn_number = Number(stx_odn);


  return stx_odn_number;

}

export default fetchPoolData ;



