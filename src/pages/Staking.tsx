import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faMoon,
  faSun,
  faWallet,
  faChartLine,
  faHome,
  faGift,
  faLock,
  faClock,
  faFire,
  faArrowRight,
  faTrophy,
  faPercent,
  faShieldHalved,
  faBolt,
  faUsers,
  faVoteYea,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Staking = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : false;
  });
  const [stakeAmount, setStakeAmount] = useState("");
  const [sliderValue, setSliderValue] = useState([0]);
  const [selectedDuration, setSelectedDuration] = useState<number>(30);

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

  // Mock wallet balance
  const novaBalance = 15000;
  const novaPrice = 2.45;

  // Staking tiers with different APYs based on lock duration
  const stakingTiers = [
    { duration: 30, apy: 12, multiplier: 1, label: "Flexible" },
    { duration: 90, apy: 18, multiplier: 1.5, label: "3 Months" },
    { duration: 180, apy: 25, multiplier: 2, label: "6 Months" },
    { duration: 365, apy: 35, multiplier: 3, label: "1 Year" },
  ];

  // Mock staking stats
  const stakingStats = {
    totalStaked: 2450000,
    totalStakers: 12450,
    rewardsDistributed: 185000,
    currentAPY: stakingTiers.find((t) => t.duration === selectedDuration)?.apy || 12,
  };

  // User's staked positions
  const stakedPositions = [
    {
      id: 1,
      amount: 5000,
      duration: 90,
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      earned: 225,
      apy: 18,
      progress: 67,
    },
    {
      id: 2,
      amount: 2500,
      duration: 365,
      startDate: "2024-02-01",
      endDate: "2025-02-01",
      earned: 145,
      apy: 35,
      progress: 25,
    },
  ];

  // Rewards history
  const rewardsHistory = [
    { date: "Today", amount: 12.5, type: "Staking Rewards" },
    { date: "Yesterday", amount: 12.3, type: "Staking Rewards" },
    { date: "2 days ago", amount: 8.5, type: "Referral Bonus" },
    { date: "3 days ago", amount: 12.1, type: "Staking Rewards" },
    { date: "1 week ago", amount: 50, type: "Early Adopter Bonus" },
  ];

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    const newAmount = (novaBalance * value[0]) / 100;
    setStakeAmount(newAmount.toFixed(2));
  };

  const handleAmountChange = (value: string) => {
    setStakeAmount(value);
    const numValue = parseFloat(value) || 0;
    const percentage = Math.min((numValue / novaBalance) * 100, 100);
    setSliderValue([percentage]);
  };

  const calculateEstimatedRewards = () => {
    const amount = parseFloat(stakeAmount) || 0;
    const tier = stakingTiers.find((t) => t.duration === selectedDuration);
    if (!tier) return 0;
    return (amount * tier.apy * (selectedDuration / 365)) / 100;
  };

  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (parseFloat(stakeAmount) > novaBalance) {
      toast.error("Insufficient balance");
      return;
    }
    toast.success(`Successfully staked ${stakeAmount} NOVA for ${selectedDuration} days!`);
    setStakeAmount("");
    setSliderValue([0]);
  };

  const handleClaim = () => {
    const totalClaimable = stakedPositions.reduce((sum, pos) => sum + pos.earned, 0);
    if (totalClaimable <= 0) {
      toast.error("No rewards to claim");
      return;
    }
    toast.success(`Claimed ${totalClaimable.toFixed(2)} NOVA rewards!`);
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
              <Link to="/">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Home
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/markets">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <FontAwesomeIcon icon={faCoins} className="mr-2" />
                  Markets
                </Button>
              </Link>
              <Link to="/governance">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
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
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Staking & Rewards</h1>
            <p className="text-muted-foreground">Stake NOVA tokens to earn protocol rewards and governance power</p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faLock} className="text-primary" />
                <span className="text-sm text-muted-foreground">Total Staked</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold">{stakingStats.totalStaked.toLocaleString()} NOVA</p>
              <p className="text-sm text-muted-foreground">
                ${(stakingStats.totalStaked * novaPrice).toLocaleString()}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faUsers} className="text-blue-500" />
                <span className="text-sm text-muted-foreground">Total Stakers</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold">{stakingStats.totalStakers.toLocaleString()}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faGift} className="text-green-500" />
                <span className="text-sm text-muted-foreground">Rewards Distributed</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold">{stakingStats.rewardsDistributed.toLocaleString()} NOVA</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faPercent} className="text-orange-500" />
                <span className="text-sm text-muted-foreground">Current APY</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-primary">{stakingStats.currentAPY}%</p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Staking Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-card border border-border rounded-xl p-6"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faLock} className="text-primary" />
                Stake NOVA
              </h2>

              {/* Duration Selection */}
              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-3 block">Select Lock Duration</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {stakingTiers.map((tier) => (
                    <button
                      key={tier.duration}
                      onClick={() => setSelectedDuration(tier.duration)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedDuration === tier.duration
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-semibold">{tier.label}</p>
                      <p className="text-2xl font-bold text-primary">{tier.apy}%</p>
                      <p className="text-xs text-muted-foreground">{tier.multiplier}x Multiplier</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-muted-foreground">Amount to Stake</label>
                  <span className="text-sm text-muted-foreground">
                    Balance: {novaBalance.toLocaleString()} NOVA
                  </span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={stakeAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="pr-20 text-lg"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-primary"
                    onClick={() => handleAmountChange(String(novaBalance))}
                  >
                    MAX
                  </Button>
                </div>
                <Slider
                  value={sliderValue}
                  onValueChange={handleSliderChange}
                  max={100}
                  step={1}
                  className="mt-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Staking Summary */}
              <div className="space-y-3 p-4 bg-muted/30 rounded-lg mb-6">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Lock Duration</span>
                  <span className="text-sm font-semibold">{selectedDuration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">APY</span>
                  <span className="text-sm font-semibold text-primary">
                    {stakingTiers.find((t) => t.duration === selectedDuration)?.apy}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">USD Value</span>
                  <span className="text-sm font-semibold">
                    ${((parseFloat(stakeAmount) || 0) * novaPrice).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="text-sm text-muted-foreground">Estimated Rewards</span>
                  <span className="text-sm font-semibold text-green-500">
                    +{calculateEstimatedRewards().toFixed(2)} NOVA
                  </span>
                </div>
              </div>

              <Button variant="hero" className="w-full" size="lg" onClick={handleStake}>
                <FontAwesomeIcon icon={faLock} className="mr-2" />
                Stake NOVA
              </Button>
            </motion.div>

            {/* Rewards Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Claimable Rewards */}
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FontAwesomeIcon icon={faGift} className="text-primary text-xl" />
                  <h3 className="font-bold">Claimable Rewards</h3>
                </div>
                <p className="text-3xl font-bold glow-text mb-2">
                  {stakedPositions.reduce((sum, pos) => sum + pos.earned, 0).toFixed(2)} NOVA
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  ≈ ${(stakedPositions.reduce((sum, pos) => sum + pos.earned, 0) * novaPrice).toFixed(2)}
                </p>
                <Button variant="hero" className="w-full" onClick={handleClaim}>
                  Claim Rewards
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Button>
              </div>

              {/* Recent Rewards */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTrophy} className="text-yellow-500" />
                  Recent Rewards
                </h3>
                <div className="space-y-3">
                  {rewardsHistory.slice(0, 4).map((reward, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{reward.type}</p>
                        <p className="text-xs text-muted-foreground">{reward.date}</p>
                      </div>
                      <span className="text-sm font-semibold text-green-500">+{reward.amount} NOVA</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Active Stakes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="text-blue-500" />
              Your Active Stakes
            </h2>
            {stakedPositions.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {stakedPositions.map((position) => (
                  <div
                    key={position.id}
                    className="p-4 bg-background rounded-xl border border-border/50 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <FontAwesomeIcon icon={faCoins} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{position.amount.toLocaleString()} NOVA</p>
                          <p className="text-xs text-muted-foreground">
                            ${(position.amount * novaPrice).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">{position.apy}% APY</p>
                        <p className="text-xs text-muted-foreground">{position.duration} days lock</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{position.progress}%</span>
                      </div>
                      <Progress value={position.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{position.startDate}</span>
                        <span>{position.endDate}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-border/50">
                      <span className="text-sm text-muted-foreground">Earned</span>
                      <span className="font-semibold text-green-500">+{position.earned} NOVA</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FontAwesomeIcon icon={faLock} className="text-4xl mb-4 opacity-50" />
                <p>No active stakes. Start staking to earn rewards!</p>
              </div>
            )}
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid sm:grid-cols-3 gap-6"
          >
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faPercent} className="text-primary text-2xl" />
              </div>
              <h3 className="font-bold mb-2">High APY Returns</h3>
              <p className="text-sm text-muted-foreground">
                Earn up to 35% APY by staking your NOVA tokens with longer lock periods
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faShieldHalved} className="text-blue-500 text-2xl" />
              </div>
              <h3 className="font-bold mb-2">Governance Power</h3>
              <p className="text-sm text-muted-foreground">
                Staked tokens give you voting power to shape the protocol's future
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faBolt} className="text-orange-500 text-2xl" />
              </div>
              <h3 className="font-bold mb-2">Fee Discounts</h3>
              <p className="text-sm text-muted-foreground">
                Get reduced fees on all protocol operations based on your stake
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Staking;
