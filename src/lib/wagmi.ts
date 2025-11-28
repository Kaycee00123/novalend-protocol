import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, polygon, arbitrum } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Novalend',
  projectId: 'YOUR_PROJECT_ID', // Get this from WalletConnect Cloud
  chains: [mainnet, sepolia, polygon, arbitrum],
  ssr: false,
});
