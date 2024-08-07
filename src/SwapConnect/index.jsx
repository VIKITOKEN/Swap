import { useState, useContext, createContext } from "react";

// Create a context for the wallet state
const WalletContext = createContext();

export const useWallet = () => {
  const [connectWallet, setConnectWallet] = useState(false);
  return { connectWallet, setConnectWallet };
};

// Custom provider component to wrap your app
export const WalletProvider = ({ children }) => {
  const wallet = useWallet(); // Initialize the hook

  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the wallet state anywhere within your components
export const useWalletContext = () => {
  return useContext(WalletContext);
};
