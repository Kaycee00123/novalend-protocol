import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faArrowRight,
  faMoon,
  faSun,
  faWallet,
  faChartLine,
  faHome,
  faTimes,
  faArrowDown,
  faArrowUp,
  faInfoCircle,
  faGift,
  faVoteYea,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Markets = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : false;
  });
  const [selectedMarket, setSelectedMarket] = useState<any>(null);
  const [actionType, setActionType] = useState<"supply" | "borrow">("supply");
  const [amount, setAmount] = useState("");
  const [sliderValue, setSliderValue] = useState([0]);

  const { prices, loading: pricesLoading } = useCryptoPrices();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Generate mock price data for charts
  const generatePriceData = (basePrice: number, volatility: number) => {
    const data = [];
    let price = basePrice;
    for (let i = 0; i < 30; i++) {
      const change = (Math.random() - 0.5) * volatility;
      price = price + change;
      data.push({ value: price });
    }
    return data;
  };

  // Mock wallet balance
  const walletBalances: Record<string, number> = {
    ETH: 10.5,
    USDC: 25000,
    WBTC: 0.8,
    DAI: 15000,
    MATIC: 5000,
    LINK: 200,
  };

  // Markets with live prices from CoinGecko
  const markets = useMemo(() => {
    const baseMarkets = [
      {
        name: "Ethereum",
        symbol: "ETH",
        supplyAPY: 3.24,
        borrowAPY: 5.67,
        totalSupply: "$458M",
        totalBorrow: "$312M",
        utilization: 68,
        collateralFactor: 75,
        icon: "💎",
        fallbackPrice: 2800,
      },
      {
        name: "USD Coin",
        symbol: "USDC",
        supplyAPY: 4.12,
        borrowAPY: 6.89,
        totalSupply: "$672M",
        totalBorrow: "$489M",
        utilization: 73,
        collateralFactor: 80,
        icon: "💵",
        fallbackPrice: 1,
      },
      {
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
        supplyAPY: 2.89,
        borrowAPY: 4.52,
        totalSupply: "$324M",
        totalBorrow: "$198M",
        utilization: 61,
        collateralFactor: 70,
        icon: "₿",
        fallbackPrice: 45000,
      },
      {
        name: "Dai",
        symbol: "DAI",
        supplyAPY: 3.98,
        borrowAPY: 6.34,
        totalSupply: "$512M",
        totalBorrow: "$384M",
        utilization: 75,
        collateralFactor: 75,
        icon: "◈",
        fallbackPrice: 1,
      },
      {
        name: "Polygon",
        symbol: "MATIC",
        supplyAPY: 5.67,
        borrowAPY: 8.92,
        totalSupply: "$189M",
        totalBorrow: "$134M",
        utilization: 71,
        collateralFactor: 60,
        icon: "🔷",
        fallbackPrice: 0.85,
      },
      {
        name: "Chainlink",
        symbol: "LINK",
        supplyAPY: 4.45,
        borrowAPY: 7.23,
        totalSupply: "$234M",
        totalBorrow: "$156M",
        utilization: 67,
        collateralFactor: 65,
        icon: "🔗",
        fallbackPrice: 15,
      },
    ];

    return baseMarkets.map((market) => {
      const livePrice = prices.find((p) => p.symbol === market.symbol);
      const price = livePrice ? livePrice.price : market.fallbackPrice;
      const change24h = livePrice ? livePrice.change24h : 0;
      return {
        ...market,
        price,
        change24h,
        priceData: generatePriceData(price, price * 0.02),
      };
    });
  }, [prices]);

  const openModal = (market: typeof markets[0], type: "supply" | "borrow") => {
    setSelectedMarket(market);
    setActionType(type);
    setAmount("");
    setSliderValue([0]);
  };

  const closeModal = () => {
    setSelectedMarket(null);
    setAmount("");
    setSliderValue([0]);
  };

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    if (selectedMarket) {
      const balance = walletBalances[selectedMarket.symbol] || 0;
      const newAmount = (balance * value[0]) / 100;
      setAmount(newAmount.toFixed(selectedMarket.price >= 100 ? 4 : 2));
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (selectedMarket) {
      const balance = walletBalances[selectedMarket.symbol] || 0;
      const numValue = parseFloat(value) || 0;
      const percentage = Math.min((numValue / balance) * 100, 100);
      setSliderValue([percentage]);
    }
  };

  const calculateEstimatedEarnings = () => {
    if (!selectedMarket || !amount) return 0;
    const numAmount = parseFloat(amount) || 0;
    const rate = actionType === "supply" ? selectedMarket.supplyAPY : selectedMarket.borrowAPY;
    return (numAmount * selectedMarket.price * rate) / 100;
  };

  const handleTransaction = () => {
    if (!selectedMarket || !amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    toast.success(
      `${actionType === "supply" ? "Supplied" : "Borrowed"} ${amount} ${selectedMarket.symbol} successfully!`
    );
    closeModal();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center glow-border">
                  <FontAwesomeIcon icon={faCoins} className="text-primary-foreground text-lg sm:text-xl" />
                </div>
                <span className="text-xl sm:text-2xl font-bold glow-text">Novalend</span>
              </Link>
            </motion.div>

            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Home
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/staking">
                <Button variant="ghost" size="sm">
                  <FontAwesomeIcon icon={faGift} className="mr-2" />
                  Staking
                </Button>
              </Link>
              <Link to="/governance">
                <Button variant="ghost" size="sm">
                  <FontAwesomeIcon icon={faVoteYea} className="mr-2" />
                  Governance
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
              </Button>
              <ConnectButton />
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto space-y-8">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Markets</h1>
            <p className="text-muted-foreground">Supply assets to earn interest or borrow against your collateral</p>
          </motion.div>

          {/* Market Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Market Size</p>
              <p className="text-xl sm:text-2xl font-bold">$2.39B</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Borrowed</p>
              <p className="text-xl sm:text-2xl font-bold">$1.67B</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <p className="text-sm text-muted-foreground mb-1">Average Supply APY</p>
              <p className="text-xl sm:text-2xl font-bold text-green-500">4.06%</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <p className="text-sm text-muted-foreground mb-1">Average Borrow APY</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-500">6.60%</p>
            </div>
          </motion.div>

          {/* Markets Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            {pricesLoading && (
              <div className="px-6 py-2 bg-primary/10 text-sm text-primary">
                Loading live prices from CoinGecko...
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Asset</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Supply APY</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Borrow APY</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Total Supply</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Utilization</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {markets.map((market, index) => (
                    <motion.tr
                      key={market.symbol}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{market.icon}</span>
                          <div>
                            <p className="font-semibold">{market.name}</p>
                            <p className="text-sm text-muted-foreground">{market.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">${market.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className={`text-xs ${market.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-green-500">{market.supplyAPY}%</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-orange-500">{market.borrowAPY}%</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{market.totalSupply}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${market.utilization}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{market.utilization}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openModal(market, "supply")}
                            className="text-green-500 border-green-500/30 hover:bg-green-500/10"
                          >
                            Supply
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openModal(market, "borrow")}
                            className="text-orange-500 border-orange-500/30 hover:bg-orange-500/10"
                          >
                            Borrow
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Supply/Borrow Modal */}
      <AnimatePresence>
        {selectedMarket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedMarket.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold">{selectedMarket.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedMarket.symbol}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={closeModal}>
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
              </div>

              {/* Action Tabs */}
              <Tabs value={actionType} onValueChange={(value) => setActionType(value as "supply" | "borrow")} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="supply">Supply</TabsTrigger>
                  <TabsTrigger value="borrow">Borrow</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Amount Input */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-muted-foreground">Amount</label>
                    <span className="text-sm text-muted-foreground">
                      Balance: {walletBalances[selectedMarket.symbol]} {selectedMarket.symbol}
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="pr-16"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 text-xs"
                      onClick={() => handleAmountChange(walletBalances[selectedMarket.symbol].toString())}
                    >
                      MAX
                    </Button>
                  </div>
                </div>

                {/* Slider */}
                <div className="space-y-2">
                  <Slider
                    value={sliderValue}
                    onValueChange={handleSliderChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{actionType === "supply" ? "Supply" : "Borrow"} APY</span>
                    <span className="font-medium">
                      {actionType === "supply" ? selectedMarket.supplyAPY : selectedMarket.borrowAPY}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated yearly earnings</span>
                    <span className="font-medium text-primary">
                      ${calculateEstimatedEarnings().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {actionType === "borrow" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Collateral Factor</span>
                      <span className="font-medium">{selectedMarket.collateralFactor}%</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  variant="hero"
                  className="w-full"
                  size="lg"
                  onClick={handleTransaction}
                >
                  {actionType === "supply" ? "Supply" : "Borrow"} {selectedMarket.symbol}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Markets;
