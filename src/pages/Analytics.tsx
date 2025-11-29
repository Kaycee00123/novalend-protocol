import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faMoon,
  faSun,
  faChartLine,
  faHome,
  faGift,
  faVoteYea,
  faArrowUp,
  faArrowDown,
  faUsers,
  faDollarSign,
  faChartBar,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Analytics = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : false;
  });
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");

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

  // Generate historical data based on time range
  const generateHistoricalData = (days: number) => {
    const data = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate realistic looking data with trends
      const dayProgress = (days - i) / days;
      const tvl = 1200000000 + Math.sin(dayProgress * Math.PI) * 300000000 + Math.random() * 50000000;
      const supplyAPY = 3.8 + Math.sin(dayProgress * Math.PI * 2) * 0.8 + Math.random() * 0.3;
      const borrowAPY = 6.2 + Math.sin(dayProgress * Math.PI * 2) * 1.2 + Math.random() * 0.4;
      const activeUsers = Math.floor(8000 + dayProgress * 4000 + Math.random() * 500);
      const revenue = Math.floor(120000 + Math.sin(dayProgress * Math.PI) * 30000 + Math.random() * 5000);
      const transactions = Math.floor(1200 + Math.random() * 300);
      
      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        fullDate: date.toISOString(),
        tvl: Math.floor(tvl),
        supplyAPY: parseFloat(supplyAPY.toFixed(2)),
        borrowAPY: parseFloat(borrowAPY.toFixed(2)),
        activeUsers,
        revenue,
        transactions,
        volume: Math.floor(tvl * 0.15 + Math.random() * 20000000),
      });
    }
    
    return data;
  };

  const getDaysFromTimeRange = (range: string) => {
    switch (range) {
      case "7d": return 7;
      case "30d": return 30;
      case "90d": return 90;
      case "1y": return 365;
      default: return 30;
    }
  };

  const historicalData = useMemo(
    () => generateHistoricalData(getDaysFromTimeRange(timeRange)),
    [timeRange]
  );

  // Calculate key metrics
  const latestData = historicalData[historicalData.length - 1];
  const oldestData = historicalData[0];
  
  const tvlChange = ((latestData.tvl - oldestData.tvl) / oldestData.tvl) * 100;
  const apyChange = ((latestData.supplyAPY - oldestData.supplyAPY) / oldestData.supplyAPY) * 100;
  const userGrowth = ((latestData.activeUsers - oldestData.activeUsers) / oldestData.activeUsers) * 100;
  const revenueChange = ((latestData.revenue - oldestData.revenue) / oldestData.revenue) * 100;

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(2)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
    return value.toString();
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

            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Home
                </Button>
              </Link>
              <Link to="/dashboard" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  <FontAwesomeIcon icon={faWallet} className="mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/markets" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  <FontAwesomeIcon icon={faCoins} className="mr-2" />
                  Markets
                </Button>
              </Link>
              <Link to="/staking" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  <FontAwesomeIcon icon={faGift} className="mr-2" />
                  Staking
                </Button>
              </Link>
              <Link to="/governance" className="hidden sm:block">
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
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Analytics</h1>
              <p className="text-muted-foreground">
                Track protocol performance and historical trends
              </p>
            </div>
            <div className="flex gap-2">
              {["7d", "30d", "90d", "1y"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range as typeof timeRange)}
                >
                  {range}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Value Locked</span>
                <FontAwesomeIcon icon={faChartBar} className="text-primary" />
              </div>
              <p className="text-2xl font-bold mb-1">{formatCurrency(latestData.tvl)}</p>
              <div className="flex items-center gap-1 text-sm">
                <FontAwesomeIcon
                  icon={tvlChange >= 0 ? faArrowUp : faArrowDown}
                  className={tvlChange >= 0 ? "text-green-500" : "text-red-500"}
                />
                <span className={tvlChange >= 0 ? "text-green-500" : "text-red-500"}>
                  {Math.abs(tvlChange).toFixed(2)}%
                </span>
                <span className="text-muted-foreground">vs {timeRange}</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Supply APY</span>
                <FontAwesomeIcon icon={faChartLine} className="text-green-500" />
              </div>
              <p className="text-2xl font-bold mb-1">{latestData.supplyAPY}%</p>
              <div className="flex items-center gap-1 text-sm">
                <FontAwesomeIcon
                  icon={apyChange >= 0 ? faArrowUp : faArrowDown}
                  className={apyChange >= 0 ? "text-green-500" : "text-red-500"}
                />
                <span className={apyChange >= 0 ? "text-green-500" : "text-red-500"}>
                  {Math.abs(apyChange).toFixed(2)}%
                </span>
                <span className="text-muted-foreground">vs {timeRange}</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <FontAwesomeIcon icon={faUsers} className="text-blue-500" />
              </div>
              <p className="text-2xl font-bold mb-1">{formatNumber(latestData.activeUsers)}</p>
              <div className="flex items-center gap-1 text-sm">
                <FontAwesomeIcon
                  icon={userGrowth >= 0 ? faArrowUp : faArrowDown}
                  className={userGrowth >= 0 ? "text-green-500" : "text-red-500"}
                />
                <span className={userGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                  {Math.abs(userGrowth).toFixed(2)}%
                </span>
                <span className="text-muted-foreground">vs {timeRange}</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Protocol Revenue</span>
                <FontAwesomeIcon icon={faDollarSign} className="text-orange-500" />
              </div>
              <p className="text-2xl font-bold mb-1">{formatCurrency(latestData.revenue)}</p>
              <div className="flex items-center gap-1 text-sm">
                <FontAwesomeIcon
                  icon={revenueChange >= 0 ? faArrowUp : faArrowDown}
                  className={revenueChange >= 0 ? "text-green-500" : "text-red-500"}
                />
                <span className={revenueChange >= 0 ? "text-green-500" : "text-red-500"}>
                  {Math.abs(revenueChange).toFixed(2)}%
                </span>
                <span className="text-muted-foreground">vs {timeRange}</span>
              </div>
            </div>
          </motion.div>

          {/* Charts Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="tvl" className="w-full">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="tvl">TVL</TabsTrigger>
                <TabsTrigger value="apy">APY Trends</TabsTrigger>
                <TabsTrigger value="users">User Activity</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
              </TabsList>

              {/* TVL Chart */}
              <TabsContent value="tvl" className="mt-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">Total Value Locked Over Time</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={historicalData}>
                      <defs>
                        <linearGradient id="colorTvl" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                        tickFormatter={(value) => formatCurrency(value)}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [formatCurrency(value), "TVL"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="tvl"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorTvl)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              {/* APY Trends Chart */}
              <TabsContent value="apy" className="mt-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">APY Trends</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value}%`, ""]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="supplyAPY"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={false}
                        name="Supply APY"
                      />
                      <Line
                        type="monotone"
                        dataKey="borrowAPY"
                        stroke="#f97316"
                        strokeWidth={2}
                        dot={false}
                        name="Borrow APY"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              {/* User Activity Chart */}
              <TabsContent value="users" className="mt-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">User Activity Metrics</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                        tickFormatter={(value) => formatNumber(value)}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [formatNumber(value), ""]}
                      />
                      <Legend />
                      <Bar dataKey="activeUsers" fill="#3b82f6" name="Active Users" />
                      <Bar dataKey="transactions" fill="#8b5cf6" name="Transactions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              {/* Revenue Chart */}
              <TabsContent value="revenue" className="mt-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">Protocol Revenue & Volume</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={historicalData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                        tickFormatter={(value) => formatCurrency(value)}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [formatCurrency(value), ""]}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#f97316"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        name="Revenue"
                      />
                      <Area
                        type="monotone"
                        dataKey="volume"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorVolume)"
                        name="Volume"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Additional Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="text-sm text-muted-foreground mb-2">Avg Daily Volume</h4>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  historicalData.reduce((sum, d) => sum + d.volume, 0) / historicalData.length
                )}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="text-sm text-muted-foreground mb-2">Total Transactions</h4>
              <p className="text-2xl font-bold">
                {formatNumber(historicalData.reduce((sum, d) => sum + d.transactions, 0))}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="text-sm text-muted-foreground mb-2">Total Revenue</h4>
              <p className="text-2xl font-bold">
                {formatCurrency(historicalData.reduce((sum, d) => sum + d.revenue, 0))}
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
