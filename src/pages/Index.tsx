import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faShieldHalved,
  faCoins,
  faBolt,
  faUsers,
  faArrowRight,
  faLock,
  faGlobe,
  faChartBar,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faDiscord,
  faTelegram,
  faGithub,
  faMedium,
} from "@fortawesome/free-brands-svg-icons";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-lending.jpg";

const Index = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

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

  const stats = [
    { label: "Total Value Locked", value: "$2.4B+", icon: faChartLine },
    { label: "Active Users", value: "150K+", icon: faUsers },
    { label: "Assets Supported", value: "25+", icon: faCoins },
    { label: "Transactions", value: "5M+", icon: faBolt },
  ];

  const features = [
    {
      icon: faShieldHalved,
      title: "Secure & Audited",
      description:
        "Multi-layered security with regular smart contract audits by leading security firms",
    },
    {
      icon: faBolt,
      title: "Lightning Fast",
      description:
        "Built on MegaETH for instant transactions with minimal gas fees and maximum throughput",
    },
    {
      icon: faChartBar,
      title: "Optimized Yields",
      description:
        "Algorithmic interest rates that adapt to market conditions for best returns",
    },
    {
      icon: faGlobe,
      title: "Cross-Chain Ready",
      description:
        "Seamless bridging between multiple chains for maximum liquidity and flexibility",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Connect Wallet",
      description: "Link your Web3 wallet to access the Novalend Protocol",
    },
    {
      step: "02",
      title: "Supply Assets",
      description: "Deposit your crypto assets to start earning interest instantly",
    },
    {
      step: "03",
      title: "Borrow or Lend",
      description: "Use your collateral to borrow or let others borrow your assets",
    },
    {
      step: "04",
      title: "Earn Rewards",
      description: "Collect yields and governance tokens as you participate",
    },
  ];

  const markets = [
    {
      name: "Ethereum",
      symbol: "ETH",
      supplyAPY: "3.24",
      borrowAPY: "5.67",
      totalLiquidity: "$458M",
      icon: "💎",
      priceData: generatePriceData(2800, 50),
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      supplyAPY: "4.12",
      borrowAPY: "6.89",
      totalLiquidity: "$672M",
      icon: "💵",
      priceData: generatePriceData(1, 0.01),
    },
    {
      name: "Wrapped Bitcoin",
      symbol: "WBTC",
      supplyAPY: "2.89",
      borrowAPY: "4.52",
      totalLiquidity: "$324M",
      icon: "₿",
      priceData: generatePriceData(45000, 800),
    },
    {
      name: "Dai",
      symbol: "DAI",
      supplyAPY: "3.98",
      borrowAPY: "6.34",
      totalLiquidity: "$512M",
      icon: "◈",
      priceData: generatePriceData(1, 0.008),
    },
    {
      name: "Polygon",
      symbol: "MATIC",
      supplyAPY: "5.67",
      borrowAPY: "8.92",
      totalLiquidity: "$189M",
      icon: "🔷",
      priceData: generatePriceData(0.85, 0.03),
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      supplyAPY: "4.45",
      borrowAPY: "7.23",
      totalLiquidity: "$234M",
      icon: "🔗",
      priceData: generatePriceData(15, 0.5),
    },
  ];

  const faqs = [
    {
      question: "How does lending work on Novalend?",
      answer:
        "When you supply assets to Novalend, you become a liquidity provider. Your assets are pooled with others and made available for borrowers. In return, you earn interest based on the utilization rate of the pool. Interest accrues in real-time and you can withdraw your assets at any time, subject to available liquidity.",
    },
    {
      question: "What determines the interest rates?",
      answer:
        "Interest rates on Novalend are determined algorithmically based on supply and demand. When utilization is high (more borrowing), rates increase to incentivize more lending. When utilization is low, rates decrease to encourage borrowing. This creates a dynamic market-driven interest rate model.",
    },
    {
      question: "Is my money safe on Novalend?",
      answer:
        "Novalend implements multiple security measures including smart contract audits by leading security firms, over-collateralization requirements for borrowers, automatic liquidation mechanisms, and decentralized governance. However, DeFi protocols carry inherent risks and you should only invest what you can afford to lose.",
    },
    {
      question: "What is the collateralization ratio?",
      answer:
        "Different assets have different collateralization ratios based on their risk profile. For example, you might be able to borrow up to 75% of your ETH collateral value, but only 50% of a more volatile asset. This protects the protocol from under-collateralized positions.",
    },
    {
      question: "What happens if my loan gets liquidated?",
      answer:
        "If your collateral value falls below the liquidation threshold, liquidators can repay your debt in exchange for your collateral at a discount (liquidation penalty). To avoid liquidation, monitor your health factor and add more collateral or repay debt when needed.",
    },
    {
      question: "Can I use Novalend without connecting a wallet?",
      answer:
        "You can view markets, rates, and protocol statistics without connecting a wallet. However, to supply assets, borrow, or earn rewards, you need to connect a Web3 wallet like MetaMask, WalletConnect, or Coinbase Wallet.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center glow-border">
                <FontAwesomeIcon icon={faCoins} className="text-primary-foreground text-lg sm:text-xl" />
              </div>
              <span className="text-xl sm:text-2xl font-bold glow-text">Novalend</span>
            </motion.div>

            {/* Right side buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 sm:gap-4"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
              </Button>
              <Link to="/dashboard">
                <Button variant="hero" size="lg" className="text-sm sm:text-base">
                  Launch App
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 sm:space-y-8 text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                Lend, Borrow,{" "}
                <span className="glow-text">Earn</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                The next-generation DeFi lending protocol on MegaETH. Supply
                assets, earn interest, and unlock liquidity with lightning-fast
                transactions and optimized yields.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/markets">
                  <Button variant="hero" size="lg" className="text-base sm:text-lg">
                    Start Lending
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-base sm:text-lg">
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src={heroImage}
                alt="DeFi Lending Illustration"
                className="rounded-2xl shadow-2xl animate-float w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Protocol Statistics
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Real-time metrics from the Novalend ecosystem
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-xl p-4 sm:p-6 text-center hover:shadow-lg hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FontAwesomeIcon
                    icon={stat.icon}
                    className="text-primary text-xl sm:text-2xl"
                  />
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 glow-text">
                  {stat.value}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Markets Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Lending Markets
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Explore our supported assets and competitive rates
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {markets.map((market, index) => (
              <motion.div
                key={market.symbol}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 text-3xl flex items-center justify-center">
                      {market.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{market.name}</h3>
                      <p className="text-sm text-muted-foreground">{market.symbol}</p>
                    </div>
                  </div>
                </div>

                {/* Price Chart */}
                <div className="h-16 mb-4 -mx-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={market.priceData}>
                      <defs>
                        <linearGradient id={`gradient-${market.symbol}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fill={`url(#gradient-${market.symbol})`}
                        isAnimationActive={true}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Supply APY</span>
                    <span className="text-lg font-bold text-primary">{market.supplyAPY}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Borrow APY</span>
                    <span className="text-lg font-bold text-foreground">{market.borrowAPY}%</span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Liquidity</span>
                      <span className="text-base font-semibold">{market.totalLiquidity}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose Novalend?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Built for speed, security, and maximum yield optimization
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-xl p-6 sm:p-8 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FontAwesomeIcon
                    icon={feature.icon}
                    className="text-primary text-xl sm:text-2xl"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Get started with Novalend in four simple steps
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-card border border-border rounded-xl p-6 sm:p-8 hover:border-primary/50 transition-all duration-300">
                  <div className="text-5xl sm:text-6xl font-bold text-primary/20 mb-3 sm:mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-primary/30 text-xl"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 sm:p-12 lg:p-16 text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of users earning passive income with Novalend Protocol
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button variant="hero" size="lg" className="text-base sm:text-lg">
                  Launch App
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-base sm:text-lg">
                View Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Everything you need to know about Novalend Protocol
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 hover:border-primary/50 transition-all duration-300"
                >
                  <AccordionTrigger className="text-left text-base sm:text-lg font-semibold hover:text-primary py-4 sm:py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm sm:text-base text-muted-foreground pb-4 sm:pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faCoins}
                    className="text-primary-foreground text-lg sm:text-xl"
                  />
                </div>
                <span className="text-xl sm:text-2xl font-bold">Novalend</span>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                The next-generation DeFi lending protocol built on MegaETH.
              </p>
              <div className="flex gap-3 sm:gap-4">
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <FontAwesomeIcon icon={faDiscord} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <FontAwesomeIcon icon={faTelegram} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <FontAwesomeIcon icon={faMedium} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Protocol</h4>
              <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Markets
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Governance
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Audits
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Resources</h4>
              <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Whitepaper
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Company</h4>
              <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Press Kit
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm sm:text-base text-muted-foreground">
            <p>© 2024 Novalend Protocol. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
