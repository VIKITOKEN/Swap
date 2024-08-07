import fs from 'fs/promises'; 
import fetch from 'node-fetch';

async function getAddressTransactions(address, limit = 30) {
  let offset = 0;
  let allTransactions = [];

  try {
    while (true) {
      const url = `https://api.mainnet.hiro.so/extended/v2/addresses/${address}/transactions?limit=${limit}&offset=${offset}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        const results = data.results.map(tx => tx.tx.sender_address) || [];

        if (results.length === 0) {
          break; 
        }

        allTransactions = [...allTransactions, ...results];
        offset += limit; 
      } else if (response.status === 404) {
        console.error("Cannot find transactions for the given address");
        break;
      } else {
        console.error("An error occurred:", response.statusText);
        break;
      }
    }

    // Save transactions to a JSON file
    const fileName = `transactions_${address}.json`;
    await fs.writeFile(fileName, JSON.stringify(allTransactions, null, 2));
    console.log(`Transactions saved to ${fileName}`);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Example usage
getAddressTransactions("SPNZPTGSBE66R85NZWZMQJ7ZNK514CXV1CWEB2MQ.odn-aggregator", 30);
