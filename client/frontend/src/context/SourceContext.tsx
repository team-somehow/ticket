import React, { createContext, useContext, useState, ReactNode } from "react";
import { useWallet } from "@coinbase/onchainkit";

type SourceContextType = {
  wallet: any;
  connect: () => void;
  disconnect: () => void;
};

const SourceContext = createContext<SourceContextType | undefined>(undefined);

export const SourceProvider = ({ children }: { children: ReactNode }) => {
  const { wallet, connect, disconnect } = useWallet();

  return (
    <SourceContext.Provider value={{ wallet, connect, disconnect }}>
      {children}
    </SourceContext.Provider>
  );
};

export const useSource = () => {
  const context = useContext(SourceContext);
  if (!context) {
    throw new Error("useSource must be used within a SourceProvider");
  }
  return context;
};
