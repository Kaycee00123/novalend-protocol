import { useQuery } from "@tanstack/react-query";

interface PriceData {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_24h_vol?: number;
    usd_market_cap?: number;
  };
}

interface MarketData {
  [key: string]: {
    total_volume: { usd: number };
    market_cap: { usd: number };
    fully_diluted_valuation: { usd: number };
    circulating_supply: number;
    total_supply: number;
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
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch prices");
  }
  
  return response.json();
};

const fetchMarketData = async (): Promise<MarketData> => {
  const ids = Object.values(COINGECKO_IDS).join(",");
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch market data");
  }
  
  const data = await response.json();
  return data.reduce((acc: MarketData, coin: any) => {
    acc[coin.id] = {
      total_volume: { usd: coin.total_volume || 0 },
      market_cap: { usd: coin.market_cap || 0 },
      fully_diluted_valuation: { usd: coin.fully_diluted_valuation || 0 },
      circulating_supply: coin.circulating_supply || 0,
      total_supply: coin.total_supply || 0,
    };
    return acc;
  }, {});
};

export const useCryptoPrices = () => {
  return useQuery({
    queryKey: ["cryptoPrices"],
    queryFn: fetchPrices,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });
};

export const useMarketData = () => {
  return useQuery({
    queryKey: ["marketData"],
    queryFn: fetchMarketData,
    refetchInterval: 60000, // Refetch every 60 seconds
    staleTime: 30000, // Consider data stale after 30 seconds
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

export const get24hVolume = (symbol: string, priceData: PriceData | undefined): number => {
  if (!priceData) return 0;
  const coingeckoId = COINGECKO_IDS[symbol];
  if (!coingeckoId || !priceData[coingeckoId]) return 0;
  return priceData[coingeckoId].usd_24h_vol || 0;
};

export const getMarketCap = (symbol: string, priceData: PriceData | undefined): number => {
  if (!priceData) return 0;
  const coingeckoId = COINGECKO_IDS[symbol];
  if (!coingeckoId || !priceData[coingeckoId]) return 0;
  return priceData[coingeckoId].usd_market_cap || 0;
};

export const getTVL = (symbol: string, marketData: MarketData | undefined): number => {
  if (!marketData) return 0;
  const coingeckoId = COINGECKO_IDS[symbol];
  if (!coingeckoId || !marketData[coingeckoId]) return 0;
  return marketData[coingeckoId].total_volume.usd || 0;
};

export const COINGECKO_ID_MAP = COINGECKO_IDS;
