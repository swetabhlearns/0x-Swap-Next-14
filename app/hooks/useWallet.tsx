import React, { createContext, useContext, ReactNode } from "react";
import { Connector, useAccount, useConnect, useDisconnect } from "wagmi";

interface WalletContextProps {
  address: string | undefined;
  isConnected: boolean;
  connectors: any;
  login: (connector: Connector) => void;
  logout: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const logout = () => {
    disconnect();
  };

  const login = (connector: Connector) => {
    connect({ connector });
  };

  return (
    <WalletContext.Provider
      value={{ address, isConnected, connectors, login, logout }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
