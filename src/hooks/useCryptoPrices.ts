import { useQuery } from "@tanstack/react-query";

interface PriceData {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

const COINGECKO_IDS: Record<string, string> = {
  ETH: "ethereum",
  USDC: "usd-coin",
  WBTC: "wrapped-bitcoin",
  DAI: "dai",
  MATIC: "matic-network",
  LINK: "chainlink",
  NOVA: "ethereum", // Using ETH as placeholder for protocol token
};

const fetchPrices = async (): Promise<PriceData> => {
  const ids = Object.values(COINGECKO_IDS).join(",");
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch prices");
  }
  
  return response.json();
};

export const useCryptoPrices = () => {
  return useQuery({
    queryKey: ["cryptoPrices"],
    queryFn: fetchPrices,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });
};

export const getPrice = (symbol: string, priceData: PriceData | undefined): number => {
  if (!priceData) return 0;
  const coingeckoId = COINGECKO_IDS[symbol];
  if (!coingeckoId || !priceData[coingeckoId]) return 0;
  return priceData[coingeckoId].usd;
};

export const get24hChange = (symbol: string, priceData: PriceData | undefined): number => {
  if (!priceData) return 0;
  const coingeckoId = COINGECKO_IDS[symbol];
  if (!coingeckoId || !priceData[coingeckoId]) return 0;
  return priceData[coingeckoId].usd_24h_change || 0;
};

export const COINGECKO_ID_MAP = COINGECKO_IDS;
