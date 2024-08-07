import React, { useState, useEffect } from "react";
import { AiOutlineSwap, AiOutlineDown } from "react-icons/ai";
import { Link } from "react-router-dom";
import STX from "../../assets/STX_token.png";
import Logo from "../../assets/header_logo2.png";
import Viki from "../../assets/hero.png";

import { userSession } from "../../utils/user-session";
import { showConnect, authenticate } from "@stacks/connect";
import { useWalletContext } from "../../SwapConnect";
import { useConnect } from "@stacks/connect-react";
import { StacksMainnet } from "@stacks/network";
import {
  AnchorMode,
  PostConditionMode,
  principalCV,
  uintCV,
} from "@stacks/transactions";
import fetchPoolData from "./test";

import { getstxBalance } from "./balances";
import { getodinBalance } from "./balances";
import { tokens } from "./tokenIDs";


const VikingTokenPurchase = () => {

  const [stxAmount, setStxAmount] = useState(0);
  const [swapAmount, setSwapAmount] = useState(0);
  const [swapBalance, setSwapBalance] = useState(0);
  const [vikingPoints, setVikingPoints] = useState(null);
  const [swapToken, setSwapToken] = useState(true);
  const { connectWallet, setConnectWallet } = useWalletContext();
  const { doContractCall, authOrigin } = useConnect();
  const [stxOdn, setStxOdn] = useState(null);

  const [stxBalance, setStxBalance] = useState(null);
  const [odinBalance, setOdinBalance] = useState(null);
  const [showTokenListIn, setShowTokenListIn] = useState(false); // State to toggle token list for amount in
  const [showTokenListOut, setShowTokenListOut] = useState(false); // State to toggle token list for amount out

  const inputAmount = (amount) => {
    setSwapAmount(amount);
    if (swapToken) {
      setStxAmount(amount * stxOdn);
    } else {
      setStxAmount(amount * (1 / stxOdn));
    }
  };

  useEffect(() => {
    // Update the input amount whenever stxOdn changes
    if (swapAmount > 0) {
      inputAmount(swapAmount);
    }
  }, [stxOdn]);

  const tokenIdentifier_odin = `SP2X2Z28NXZVJFCJPBR9Q3NBVYBK3GPX8PXA3R83C.odin-tkn::odin`;
  const tokenIdentifier_viki = `SPAAZWD8D1RXQG85HDH9NQ90DV8TGXBXS4XY02J3.vkng-token::viking`;
  
  const tokenListA = [
    { name: 'Odin', logo: Logo, id:23 },
    { name: 'Viking', logo: Viki, id:56},
    // Add more tokens as needed
  ];

  const tokenListB = [
    { name: 'STX', logo: STX ,id:1},
    // Add more tokens as needed
  ];

  const [tokenListIn, setTokenListIn] = useState(tokenListB);
  const [tokenListOut, setTokenListOut] = useState(tokenListA);
  const [selectedTokenIn, setSelectedTokenIn] = useState(tokenListB[0]);
  const [selectedTokenOut, setSelectedTokenOut] = useState(tokenListA[1]);


  const selectTokenIn = (tokenId) => {
    setSelectedTokenIn(() => {
      return tokenId;
    });
    setShowTokenListIn(false);
  
  };

  const selectTokenOut = (tokenId) => {
    setSelectedTokenOut(() => {
      console.log(`Selected set Token: ${tokenId.id}`); // Debug log inside setState
      return tokenId;
    });
    
    setShowTokenListOut(false);
  };

  
  useEffect(() => {
    const fetchData = async () => {
    
      try {
        if(swapToken){
          console.log(`Selected set Token for fetchPoolData: ${selectedTokenOut.id}`); // Debug log
          const poolData = await fetchPoolData(selectedTokenOut.id);
          setStxOdn(poolData);
        }else{
          console.log(`Selected set Token for fetchPoolData: ${selectedTokenIn.id}`); // Debug log
          const poolData = await fetchPoolData(selectedTokenIn.id);
          setStxOdn(poolData);
        }
        if (connectWallet) {
          const userData = userSession.loadUserData();
          const address = userData.profile.stxAddress.mainnet;
          if(selectedTokenIn.name=="STX"){
            const stxBalance = await getstxBalance(address);
            setStxBalance(stxBalance/1000000);
            const tokenIdentifier = selectedTokenOut.name === 'Odin' ? tokenIdentifier_odin : tokenIdentifier_viki;
            const odinBalance = await getodinBalance(address, tokenIdentifier);
            setOdinBalance(odinBalance/1000000);
          }else{
            const stxBalance = await getstxBalance(address);
            const tokenIdentifier = selectedTokenIn.name === 'Odin' ? tokenIdentifier_odin : tokenIdentifier_viki;
            const odinBalance = await getodinBalance(address, tokenIdentifier);
            setOdinBalance(stxBalance/1000000);
            setStxBalance(odinBalance/1000000);


            
          }
          
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [connectWallet,selectedTokenOut, odinBalance, selectedTokenIn]); // Update when wallet connects
  

  const useMax = (balance) => {
    inputAmount(balance);
  };

  const changeToken = () => {
    setSwapToken(!swapToken);
    setStxAmount(0);
    setSwapAmount(0);
    setSwapBalance(0);
    setStxBalance(odinBalance); // Correct balance assignment
    setOdinBalance(stxBalance); // Correct balance assignment
    setTokenListIn(swapToken ? tokenListA : tokenListB);
    setTokenListOut(swapToken ? tokenListB : tokenListA);
    setSelectedTokenIn( selectedTokenOut);
    setSelectedTokenOut( selectedTokenIn);
    
  };

  function disconnect() {
    userSession.signUserOut("/swap");
    setConnectWallet(false);
  }

  function authenticate() {
    showConnect({
      appDetails: {
        name: "authenticate",
        icon: window.location.origin + "/logo512.png",
      },
      redirectTo: "/",
      onFinish: () => {
        setConnectWallet(true);
        window.location.assign();

      },
      userSession,
    });
  }

  function tokenToStx() {
    if(selectedTokenIn.id === 23 ){
      doContractCall({
        contractAddress: "SP31BV8VGBSGAR453P6PEQ9SB3AMYMZ1ATBPWDGKY",
        contractName: "aggregator-viking",
        functionName: "swap-token-to-stx",
        functionArgs: [
          uintCV(23),
          principalCV("SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx"),
          principalCV("SP2X2Z28NXZVJFCJPBR9Q3NBVYBK3GPX8PXA3R83C.odin-tkn"),
          principalCV("SP2X2Z28NXZVJFCJPBR9Q3NBVYBK3GPX8PXA3R83C.odin-tkn"),
          principalCV("SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx"),
          principalCV("SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-share-fee-to"),
          uintCV(parseInt(swapAmount) * 1000000),
          uintCV(parseInt(stxAmount * 0.95) * 1000000),
  
        ],
        userSession: userSession,
        network: new StacksMainnet(),
        anchorMode: AnchorMode.allow,
        postConditionMode: PostConditionMode.Allow,
        postConditions: [],
        onFinish: (data) => {
          console.log("onFinish:", data);
          createExplorerPopUp(data.txId);
        },
        onCancel: () => {
          console.log("onCancel:", "Transaction was canceled");
        },
      });
    } else if (selectedTokenIn.id === 56) {
      doContractCall({
        contractAddress: "SP31BV8VGBSGAR453P6PEQ9SB3AMYMZ1ATBPWDGKY",
        contractName: "aggregator-viking",
        functionName: "swap-token-to-stx",
        functionArgs: [
          uintCV(56),
          principalCV("SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx"),
          principalCV("SPAAZWD8D1RXQG85HDH9NQ90DV8TGXBXS4XY02J3.vkng-token"),
          principalCV("SPAAZWD8D1RXQG85HDH9NQ90DV8TGXBXS4XY02J3.vkng-token"),
          principalCV("SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx"),
          principalCV("SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-share-fee-to"),
          uintCV(parseInt(swapAmount) * 1000000),
          uintCV(parseInt(stxAmount * 0.95) * 1000000),
  
        ],
        userSession: userSession,
        network: new StacksMainnet(),
        anchorMode: AnchorMode.allow,
        postConditionMode: PostConditionMode.Allow,
        postConditions: [],
        onFinish: (data) => {
          console.log("onFinish:", data);
          createExplorerPopUp(data.txId);
        },
        onCancel: () => {
          console.log("onCancel:", "Transaction was canceled");
        },
      });

    }
   
  }
  


  function stxToToken() {
    if(selectedTokenOut.id == 23){
      doContractCall({
        contractAddress: "SPNZPTGSBE66R85NZWZMQJ7ZNK514CXV1CWEB2MQ",
        contractName: "odn-aggregator",
        functionName: "swap-stx-to-token",
        functionArgs: [
          uintCV(23),
          principalCV("SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx"),
          principalCV("SP2X2Z28NXZVJFCJPBR9Q3NBVYBK3GPX8PXA3R83C.odin-tkn"),
          principalCV("SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx"),
          principalCV("SP2X2Z28NXZVJFCJPBR9Q3NBVYBK3GPX8PXA3R83C.odin-tkn"),
          principalCV("SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-share-fee-to"),
          uintCV(parseInt(swapAmount) * 1000000),
          uintCV(parseInt(stxAmount*0.95)*1000000),
          principalCV("SP31BV8VGBSGAR453P6PEQ9SB3AMYMZ1ATBPWDGKY.viking"),
    
        ],
        userSession : userSession,
        network: new StacksMainnet(),
        anchorMode: AnchorMode.allow,
        postConditionMode: PostConditionMode.Allow,
        postConditions: [],
        onFinish: (data) => {
          console.log("onFinish:", data);
          createExplorerPopUp(data.txId);
          },
        onCancel: () => {
          console.log("onCancel:", "Transaction was canceled");
    },
    });
    } else if (selectedTokenOut.id === 56){
      doContractCall({
        contractAddress: "SPNZPTGSBE66R85NZWZMQJ7ZNK514CXV1CWEB2MQ",
        contractName: "odn-aggregator",
        functionName: "swap-stx-to-token",
        functionArgs: [
          uintCV(56),
          principalCV("SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx"),
          principalCV("SPAAZWD8D1RXQG85HDH9NQ90DV8TGXBXS4XY02J3.vkng-token"),
          principalCV("SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx"),
          principalCV("SPAAZWD8D1RXQG85HDH9NQ90DV8TGXBXS4XY02J3.vkng-token"),
          principalCV("SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-share-fee-to"),
          uintCV(parseInt(swapAmount) * 1000000),
          uintCV(parseInt(stxAmount*0.95)*1000000),
          principalCV("SP31BV8VGBSGAR453P6PEQ9SB3AMYMZ1ATBPWDGKY.viking"),
    
        ],
        userSession : userSession,
        network: new StacksMainnet(),
        anchorMode: AnchorMode.allow,
        postConditionMode: PostConditionMode.Allow,
        postConditions: [],
        onFinish: (data) => {
          console.log("onFinish:", data);
          createExplorerPopUp(data.txId);
          },
        onCancel: () => {
          console.log("onCancel:", "Transaction was canceled");
    },
    });
    }
    
}

function createExplorerPopUp(txId) {
  const popUp = document.createElement("div");
  popUp.style.position = "fixed";
  popUp.style.top = "100px";
  popUp.style.right = "20px";
  popUp.style.padding = "20px";
  popUp.style.backgroundColor = "#333";
  popUp.style.color = "#fff";
  popUp.style.borderRadius = "10px";
  popUp.style.zIndex = "1000";
  popUp.style.width = "300px";
  popUp.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
  popUp.innerHTML = `
    <p style="margin: 0;">Transaction completed.</p>
    <p id="elapsedTime" style="margin: 10px 0; font-size: 14px;">Elapsed time: <span id="timeElapsed">0</span> seconds</p>
    <a href="https://explorer.hiro.so/txid/${txId}?chain=mainnet" target="_blank" style="color: #4CAF50; text-decoration: none; font-weight: bold;">Go to Explorer</a>
  `;

  document.body.appendChild(popUp);

  // Start timer to update elapsed time
  let startTime = Date.now();
  setInterval(() => {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("timeElapsed").textContent = elapsedTime;
  }, 1000);

  // Set a timer to close the pop-up after 10 seconds if not clicked
  setTimeout(() => {
    if (popUp) {
      popUp.remove();
    }
  }, 10000);

  // Add event listener to remove pop-up on click
  popUp.addEventListener("click", () => {
    if (popUp) {
      popUp.remove();
    }
  });
}


  const handleAction = () => {
    if (connectWallet) {
      if (stxAmount > 0) {
        if (swapToken) {
          stxToToken();

        } else {
          tokenToStx();

        }
        
      } else {
        alert("Enter a valid STX amount to purchase Viking tokens.");
      }
    } else {
      authenticate();
    }
  };

  const toggleTokenListIn = () => {
    setShowTokenListIn(!showTokenListIn);
  };

  const toggleTokenListOut = () => {
    setShowTokenListOut(!showTokenListOut);
  };



  return (
    <div className="flex flex-col items-center relative overflow-hidden min-h-[calc(100vh-351px)]">
      <div className="flex justify-center w-full text-lg md:text-2xl text-center font-bold mb-4 z-20  md:p-4 py-10 p-2">
        Earn Both Buying and Selling
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center gap-3 z-20 mb-10">
        <div className="max-w-[430px] w-[90%] h-full px-4 py-5 bg-[#0d0805] border-[1px] rounded-lg border-[#f5f7fa08]">
          <div className="flex flex-row justify-between items-center">
            <label
              htmlFor="stxAmount"
              className="block text-lg md:text-xl font-medium text-white py-2"
            >
              Swap
            </label>
            <div
              onClick={changeToken}
              className="justify-end gap-1 flex flex-row items-center cursor-pointer pr-1"
            >
              <img src={selectedTokenIn.logo} alt="Token In" className="w-7 md:w-9" />
              <AiOutlineSwap className="" />
              <img src={selectedTokenOut.logo} alt="Token Out" className="w-6 md:w-8" />
            </div>
          </div>

          <div className="flex flex-col w-full border-[1px] border-[#f5f7fa08] bg-[#f5f7fa0a] rounded-xl my-1">
            <div className="w-full flex flex-row text-sm md:text-md font-medium items-center justify-between p-3 border-b-[#f5f7fa08] border-b-[1px]">
              <label htmlFor="stxAmount" className="block text-[#717179] ">
                Amount in Token:
              </label>
              <div className="flex flex-row items-center justify-end gap-3">
                <img src={selectedTokenIn.logo} alt="Token In" className="w-7 md:w-8" />
                <input
                  type="number"
                  id="swapAmount"
                  className="min-w-[70px] w-[90px] outline-none bg-none py-1 border-[#424242] border-[0.5px] rounded-md px-2 truncate"
                  value={swapAmount}
                  onChange={(e) => inputAmount(e.target.value)}
                />
                <AiOutlineDown className="cursor-pointer" onClick={toggleTokenListIn} />
              </div>
            </div>
            {showTokenListIn && (
              <div className="w-full flex flex-col p-3">
                {tokenListIn.map((token) => (
                  <div
                    key={token}
                    className="flex flex-row items-center justify-between cursor-pointer"
                    onClick={() => selectTokenIn(token)}
                  >
                    <img src={token.logo} alt={token.name} className="w-6 md:w-8" />
                    <p className="text-[#717179]">{token.name}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="w-full flex flex-row text-sm md:text-md font-medium items-center justify-between p-3 text-[#717179]">
              <label htmlFor="swapAmount" className="">
                Balance:
              </label>
              <div className="flex flex-row gap-2">
                <p>{stxBalance || '0.00'}</p>
                <div className="cursor-pointer text-[#f89728]" onClick={() => useMax(stxBalance)}>Use Max</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full border-[1px] border-[#f5f7fa08] bg-[#f5f7fa0a] rounded-xl my-1">
            <div
              onClick={changeToken}
              className="w-8 h-8 md:w-10 md:h-10 flex flex-col border-1px border-[#0d0805] text-[#717179] rounded-lg bg-[#040505] justify-center items-center text-2xl absolute mt-[-18px] md:mt-[-24px] right-[45%] md:right-[49%] rotate-90 cursor-pointer "
            >
              <AiOutlineSwap />
            </div>
            <div className="w-full flex flex-row text-sm md:text-md font-medium items-center justify-between p-3 border-b-[#f5f7fa08] border-b-[1px]">
              <label htmlFor="stxAmount" className="block text-[#717179] ">
                Amount out Token:
              </label>
              <div className="flex flex-row items-center justify-end gap-3">
                <img src={selectedTokenOut.logo} alt="Token Out" className="w-6 md:w-8" />
                <div className="min-w-[70px] w-[90px] outline-none bg-none py-1 border-[#424242] border-[0.5px] rounded-md px-2 truncate">
                  {stxAmount}
                </div>
                <AiOutlineDown className="cursor-pointer" onClick={toggleTokenListOut} />
              </div>
            </div>
            {showTokenListOut && (
              <div className="w-full flex flex-col p-3">
                {tokenListOut.map((token) => (
                  <div
                    key={token}
                    className="flex flex-row items-center justify-between cursor-pointer"
                    onClick={() => selectTokenOut(token)}
                  >
                    <img src={token.logo} alt={token.name} className="w-6 md:w-8" />
                    <p className="text-[#717179]">{token.name}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="w-full flex flex-row text-sm md:text-md font-medium items-center justify-between p-3 text-[#717179]">
              <label htmlFor="stxAmount" className="">
                Balance:
              </label>
              <div className="flex flex-row gap-2">
                <p>{odinBalance || '0.00'}</p>
              </div>
            </div>
          </div>

          <button
            className="w-full py-2 mt-4 text-lg font-bold text-white bg-[#f89728] rounded-md"
            onClick={handleAction}
          >
            {connectWallet ? 'Swap' : 'Connect Wallet'}
          </button>
          {connectWallet && (
            <button
              onClick={disconnect}
              className="w-full py-2 mt-2 text-lg font-bold text-white bg-[#ff4d4d] rounded-md"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VikingTokenPurchase;
