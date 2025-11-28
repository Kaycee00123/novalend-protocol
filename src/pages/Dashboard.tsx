import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faArrowUp,
  faArrowDown,
  faChartLine,
  faCoins,
  faArrowRight,
  faExchangeAlt,
  faMoon,
  faSun,
  faShieldHalved,
  faHome,
  faGift,
  faArrowTrendUp,
  faChartPie,
  faVoteYea,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ConnectButton } from "@rainbow-me/rainbowkit";

type TimePeriod = "7D" | "30D" | "90D" | "1Y";

const Dashboard = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : false;
  });
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("30D");

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

  // Get number of days based on time period
  const getDays = (period: TimePeriod): number => {
    switch (period) {
      case "7D": return 7;
      case "30D": return 30;
      case "90D": return 90;
      case "1Y": return 365;
    }
  };

  // Mock portfolio data
  const portfolioStats = {
    totalSupplied: 45820.50,
    totalBorrowed: 12450.00,
    netWorth: 33370.50,
    healthFactor: 2.45,
    availableToBorrow: 18920.00,
  };

  const suppliedPositions = [
    { asset: "ETH", symbol: "💎", amount: 5.24, value: 14672.00, apy: 3.24 },
    { asset: "USDC", symbol: "💵", amount: 15000, value: 15000.00, apy: 4.12 },
    { asset: "WBTC", symbol: "₿", amount: 0.35, value: 15750.00, apy: 2.89 },
  ];

  const borrowedPositions = [
    { asset: "DAI", symbol: "◈", amount: 8000, value: 8000.00, apy: 6.34 },
    { asset: "USDC", symbol: "💵", amount: 4450, value: 4450.00, apy: 6.89 },
  ];

  const transactions = [
    { id: 1, type: "Supply", asset: "ETH", amount: 2.5, value: 7000, time: "2 hours ago", status: "Completed" },
    { id: 2, type: "Borrow", asset: "DAI", amount: 5000, value: 5000, time: "5 hours ago", status: "Completed" },
    { id: 3, type: "Repay", asset: "USDC", amount: 1000, value: 1000, time: "1 day ago", status: "Completed" },
    { id: 4, type: "Withdraw", asset: "WBTC", amount: 0.1, value: 4500, time: "2 days ago", status: "Completed" },
    { id: 5, type: "Supply", asset: "USDC", amount: 10000, value: 10000, time: "3 days ago", status: "Completed" },
  ];

  const getHealthFactorColor = (hf: number) => {
    if (hf >= 2) return "text-green-500";
    if (hf >= 1.5) return "text-yellow-500";
    return "text-red-500";
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case "Supply": return faArrowDown;
      case "Borrow": return faArrowUp;
      case "Repay": return faArrowDown;
      case "Withdraw": return faArrowUp;
      default: return faExchangeAlt;
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "Supply": return "text-green-500 bg-green-500/10";
      case "Borrow": return "text-orange-500 bg-orange-500/10";
      case "Repay": return "text-blue-500 bg-blue-500/10";
      case "Withdraw": return "text-purple-500 bg-purple-500/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  // Generate historical portfolio data based on selected time period
  const portfolioHistory = useMemo(() => {
    const data = [];
    const today = new Date();
    const days = getDays(timePeriod);
    const dateFormat: Intl.DateTimeFormatOptions = days > 60 
      ? { month: "short" } 
      : { month: "short", day: "numeric" };
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const baseValue = 28000;
      const growth = ((days - 1 - i) / days) * (days * 6); // Growth over time
      const volatility = Math.sin(i * 0.5) * 500; // Some volatility
      const value = baseValue + growth + volatility;
      
      data.push({
        date: date.toLocaleDateString("en-US", dateFormat),
        value: parseFloat(value.toFixed(2)),
        supplied: parseFloat((value * 0.68).toFixed(2)),
        borrowed: parseFloat((value * 0.22).toFixed(2)),
      });
    }
    return data;
  }, [timePeriod]);

  // Generate earnings data based on selected time period
  const earningsHistory = useMemo(() => {
    const data = [];
    const today = new Date();
    const days = getDays(timePeriod);
    const dateFormat: Intl.DateTimeFormatOptions = days > 60 
      ? { month: "short" } 
      : { month: "short", day: "numeric" };
    let accumulated = 0;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dailyEarnings = 12 + Math.random() * 8; // Random daily earnings between 12-20
      accumulated += dailyEarnings;
      
      data.push({
        date: date.toLocaleDateString("en-US", dateFormat),
        daily: parseFloat(dailyEarnings.toFixed(2)),
        accumulated: parseFloat(accumulated.toFixed(2)),
      });
    }
    return data;
  }, [timePeriod]);

  // Asset allocation data
  const allocationData = useMemo(() => {
    return suppliedPositions.map((position) => ({
      name: position.asset,
      value: position.value,
      percentage: ((position.value / portfolioStats.totalSupplied) * 100).toFixed(1),
    }));
  }, [suppliedPositions, portfolioStats.totalSupplied]);

  // APY comparison data
  const apyComparisonData = useMemo(() => {
    return [...suppliedPositions, ...borrowedPositions.map(p => ({ ...p, apy: -p.apy }))]
      .sort((a, b) => Math.abs(b.apy) - Math.abs(a.apy));
  }, [suppliedPositions, borrowedPositions]);

  // Colors for pie chart
  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(142 76% 36%)", "hsl(221 83% 53%)", "hsl(280 100% 70%)"];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label, prefix = "$", suffix = "" }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {prefix}{entry.value.toLocaleString()}{suffix}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
              <Link to="/markets">
                <Button variant="ghost" size="sm">
                  <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                  Markets
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
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your portfolio and track your positions</p>
          </motion.div>

          {/* Portfolio Overview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faArrowDown} className="text-green-500" />
                </div>
                <span className="text-sm text-muted-foreground">Total Supplied</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">${portfolioStats.totalSupplied.toLocaleString()}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faArrowUp} className="text-orange-500" />
                </div>
                <span className="text-sm text-muted-foreground">Total Borrowed</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">${portfolioStats.totalBorrowed.toLocaleString()}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faWallet} className="text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Net Worth</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold glow-text">${portfolioStats.netWorth.toLocaleString()}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-blue-500" />
                </div>
                <span className="text-sm text-muted-foreground">Health Factor</span>
              </div>
              <div className="flex items-center gap-3">
                <p className={`text-2xl sm:text-3xl font-bold ${getHealthFactorColor(portfolioStats.healthFactor)}`}>
                  {portfolioStats.healthFactor.toFixed(2)}
                </p>
                <Progress value={Math.min(portfolioStats.healthFactor * 33, 100)} className="flex-1 h-2" />
              </div>
            </div>
          </motion.div>

          {/* Analytics Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faArrowTrendUp} className="text-primary" />
                <h2 className="text-xl font-bold">Portfolio Performance</h2>
              </div>
              <div className="flex gap-2">
                {(["7D", "30D", "90D", "1Y"] as TimePeriod[]).map((period) => (
                  <Button
                    key={period}
                    variant={timePeriod === period ? "hero" : "outline"}
                    size="sm"
                    onClick={() => setTimePeriod(period)}
                    className="text-xs sm:text-sm"
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioHistory}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSupplied" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: "12px" }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Net Worth"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="supplied"
                    name="Supplied"
                    stroke="hsl(142 76% 36%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSupplied)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Earnings and Asset Allocation */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Earnings Over Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <FontAwesomeIcon icon={faChartLine} className="text-green-500" />
                <h2 className="text-xl font-bold">Earnings Over Time</h2>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Total Earned ({timePeriod})</p>
                <p className="text-3xl font-bold text-green-500">
                  ${earningsHistory[earningsHistory.length - 1]?.accumulated.toLocaleString()}
                </p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: "11px" }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: "11px" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="accumulated"
                      name="Total Earnings"
                      stroke="hsl(142 76% 36%)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Asset Allocation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <FontAwesomeIcon icon={faChartPie} className="text-blue-500" />
                <h2 className="text-xl font-bold">Asset Allocation</h2>
              </div>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {allocationData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold">${item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* APY Performance Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <FontAwesomeIcon icon={faChartLine} className="text-orange-500" />
              <h2 className="text-xl font-bold">APY Performance</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={apyComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="asset" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: "12px" }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    content={<CustomTooltip prefix="" suffix="%" />}
                    cursor={{ fill: "hsl(var(--muted) / 0.1)" }}
                  />
                  <Bar 
                    dataKey="apy" 
                    name="APY"
                    radius={[8, 8, 0, 0]}
                  >
                    {apyComparisonData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.apy >= 0 ? "hsl(142 76% 36%)" : "hsl(25 95% 53%)"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Positions Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Supplied Positions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Supplied Assets</h2>
                <Link to="/markets">
                  <Button variant="ghost" size="sm">
                    Supply More <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {suppliedPositions.map((position) => (
                  <div
                    key={position.asset}
                    className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{position.symbol}</span>
                      <div>
                        <p className="font-semibold">{position.asset}</p>
                        <p className="text-sm text-muted-foreground">
                          {position.amount} {position.asset}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${position.value.toLocaleString()}</p>
                      <p className="text-sm text-green-500">+{position.apy}% APY</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Borrowed Positions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Borrowed Assets</h2>
                <Link to="/markets">
                  <Button variant="ghost" size="sm">
                    Borrow More <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </Button>
                </Link>
              </div>
              {borrowedPositions.length > 0 ? (
                <div className="space-y-4">
                  {borrowedPositions.map((position) => (
                    <div
                      key={position.asset}
                      className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{position.symbol}</span>
                        <div>
                          <p className="font-semibold">{position.asset}</p>
                          <p className="text-sm text-muted-foreground">
                            {position.amount.toLocaleString()} {position.asset}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${position.value.toLocaleString()}</p>
                        <p className="text-sm text-orange-500">-{position.apy}% APY</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No borrowed assets</p>
                </div>
              )}
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Available to Borrow</span>
                  <span className="font-semibold text-primary">${portfolioStats.availableToBorrow.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h2 className="text-xl font-bold mb-6">Transaction History</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getTransactionTypeColor(tx.type)}`}>
                          <FontAwesomeIcon icon={getTransactionTypeIcon(tx.type)} className="text-xs" />
                          {tx.type}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{tx.asset}</TableCell>
                      <TableCell>{tx.amount.toLocaleString()}</TableCell>
                      <TableCell>${tx.value.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">{tx.time}</TableCell>
                      <TableCell>
                        <span className="text-green-500">{tx.status}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
