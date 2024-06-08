"use client";

import { http, createStorage, cookieStorage } from "wagmi";
import { polygon } from "wagmi/chains";
import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";

const projectId = "447ea0d4837f90108a879cfbdc39329a";

const supportedChains: Chain[] = [polygon];

export const config = getDefaultConfig({
  appName: "Graph & DEX",
  projectId,
  chains: supportedChains as any,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: supportedChains.reduce(
    (obj, chain) => ({ ...obj, [chain.id]: http() }),
    {}
  ),
});
