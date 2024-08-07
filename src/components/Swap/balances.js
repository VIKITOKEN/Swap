export async function getstxBalance(address) {
  const url = `https://docs-demo.stacks-mainnet.quiknode.pro/extended/v1/address/${address}/balances`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Ensure stx object exists
    if (data.stx && data.stx.balance !== undefined) {
      const stxBalance = data.stx.balance;
      return stxBalance;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching account data:', error);
  }
}

export async function getodinBalance(address,tokenIdentifier) {
  const url = `https://docs-demo.stacks-mainnet.quiknode.pro/extended/v1/address/${address}/balances`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    //const tokenIdentifier = `SP2X2Z28NXZVJFCJPBR9Q3NBVYBK3GPX8PXA3R83C.odin-tkn::odin`;
    //const tokenIdentifier = `SPAAZWD8D1RXQG85HDH9NQ90DV8TGXBXS4XY02J3.vkng-token::viking`;

    // Ensure fungible_tokens and the specific token identifier exist
    if (data.fungible_tokens && data.fungible_tokens[tokenIdentifier]) {
      const odinTokenBalance = data.fungible_tokens[tokenIdentifier].balance;
      //console.log(odinTokenBalance)
      return odinTokenBalance;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching account data:', error);
  }
}

getodinBalance("SP1KHTT62WP9CKZ2T4MXXS3CE8FGTATY1VFZA35T3")



