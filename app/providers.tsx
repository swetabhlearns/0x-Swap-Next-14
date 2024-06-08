"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { WagmiProvider, cookieToInitialState } from "wagmi";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { config } from "@/lib/config";
import { WalletProvider } from "./hooks/useWallet";
import Navbar from "./components/header";

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
  cookie: string | null;
};

export default function Providers({ children, cookie }: Props) {
  const initialState = cookieToInitialState(config, cookie);

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider coolMode theme={lightTheme()}>
          <WalletProvider>
            <>
              <Navbar />
              {children}
            </>
          </WalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
