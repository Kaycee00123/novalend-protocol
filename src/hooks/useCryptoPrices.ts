import { useEffect, useState } from "react";

interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
}

export const useCryptoPrices = () => {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,usd-coin&vs_currencies=usd&include_24hr_change=true"
        );
        const data = await response.json();

        setPrices([
          {
            symbol: "ETH",
            price: data.ethereum.usd,
            change24h: data.ethereum.usd_24h_change,
          },
          {
            symbol: "BTC",
            price: data.bitcoin.usd,
            change24h: data.bitcoin.usd_24h_change,
          },
          {
            symbol: "USDC",
            price: data["usd-coin"].usd,
            change24h: data["usd-coin"].usd_24h_change,
          },
        ]);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch crypto prices");
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);

    return () => clearInterval(interval);
  }, []);

  return { prices, loading, error };
};
