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
  faVoteYea,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faPlus,
  faFire,
  faUsers,
  faFileAlt,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  status: "active" | "passed" | "rejected" | "pending" | "executed";
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorum: number;
  startDate: Date;
  endDate: Date;
  category: string;
}

const Governance = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : false;
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    category: "protocol",
  });

  // Mock user voting power (based on staked NOVA tokens)
  const votingPower = 7500;

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

  // Mock proposals
  const [proposals] = useState<Proposal[]>([
    {
      id: 1,
      title: "Increase USDC Collateral Factor to 85%",
      description:
        "Proposal to increase the collateral factor for USDC from 80% to 85% to improve capital efficiency for stablecoin holders.",
      proposer: "0x1234...5678",
      status: "active",
      votesFor: 45000,
      votesAgainst: 12000,
      totalVotes: 57000,
      quorum: 100000,
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-01-22"),
      category: "risk",
    },
    {
      id: 2,
      title: "Add LINK as Collateral Asset",
      description:
        "Proposal to add Chainlink (LINK) as a supported collateral asset with initial parameters of 65% collateral factor and 3.5% borrow APY.",
      proposer: "0x8765...4321",
      status: "active",
      votesFor: 38000,
      votesAgainst: 15000,
      totalVotes: 53000,
      quorum: 100000,
      startDate: new Date("2024-01-14"),
      endDate: new Date("2024-01-21"),
      category: "asset",
    },
    {
      id: 3,
      title: "Reduce Protocol Treasury Distribution",
      description:
        "Proposal to reduce treasury allocation from 10% to 8% of protocol revenues to increase rewards for NOVA stakers.",
      proposer: "0x9876...1234",
      status: "passed",
      votesFor: 125000,
      votesAgainst: 45000,
      totalVotes: 170000,
      quorum: 100000,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-08"),
      category: "treasury",
    },
    {
      id: 4,
      title: "Implement Dynamic Interest Rate Model",
      description:
        "Proposal to upgrade to a new dynamic interest rate model that adjusts rates based on real-time utilization curves.",
      proposer: "0x5555...9999",
      status: "rejected",
      votesFor: 42000,
      votesAgainst: 85000,
      totalVotes: 127000,
      quorum: 100000,
      startDate: new Date("2023-12-20"),
      endDate: new Date("2023-12-27"),
      category: "protocol",
    },
  ]);

  // Governance stats
  const governanceStats = {
    totalProposals: proposals.length,
    activeProposals: proposals.filter((p) => p.status === "active").length,
    totalVoters: 12450,
    votingPower: votingPower,
  };

  const handleVote = (id: number, support: boolean) => {
    if (votingPower <= 0) {
      toast.error("You need to stake NOVA tokens to vote");
      return;
    }

    toast.success(
      `Voted ${support ? "FOR" : "AGAINST"} proposal #${id} with ${votingPower.toLocaleString()} NOVA`
    );
  };

  const handleCreateProposal = () => {
    if (!newProposal.title || !newProposal.description) {
      toast.error("Please fill in all fields");
      return;
    }

    if (votingPower < 1000) {
      toast.error("You need at least 1,000 staked NOVA to create a proposal");
      return;
    }

    setIsCreateDialogOpen(false);
    setNewProposal({ title: "", description: "", category: "protocol" });
    toast.success("Proposal created successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-primary bg-primary/10 border-primary/30";
      case "passed":
        return "text-green-500 bg-green-500/10 border-green-500/30";
      case "rejected":
        return "text-red-500 bg-red-500/10 border-red-500/30";
      case "pending":
        return "text-orange-500 bg-orange-500/10 border-orange-500/30";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return faVoteYea;
      case "passed":
        return faCheckCircle;
      case "rejected":
        return faTimesCircle;
      case "pending":
        return faClock;
      default:
        return faFileAlt;
    }
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
                  <FontAwesomeIcon
                    icon={faCoins}
                    className="text-primary-foreground text-lg sm:text-xl"
                  />
                </div>
                <span className="text-xl sm:text-2xl font-bold glow-text">
                  Novalend
                </span>
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
                  <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/markets" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  <FontAwesomeIcon icon={faCoins} className="mr-2" />
                  Markets
                </Button>
              </Link>
              <Link to="/analytics" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                  Analytics
                </Button>
              </Link>
              <Link to="/staking" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  <FontAwesomeIcon icon={faGift} className="mr-2" />
                  Staking
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
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
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Governance
              </h1>
              <p className="text-muted-foreground">
                Shape the future of Novalend through community proposals
              </p>
            </div>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="hero" size="lg">
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Create Proposal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Proposal</DialogTitle>
                  <DialogDescription>
                    Requires 1,000+ staked NOVA tokens to create a proposal
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="title">Proposal Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter a clear and concise title"
                      value={newProposal.title}
                      onChange={(e) =>
                        setNewProposal({ ...newProposal, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      value={newProposal.category}
                      onChange={(e) =>
                        setNewProposal({
                          ...newProposal,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="protocol">Protocol Upgrade</option>
                      <option value="risk">Risk Parameters</option>
                      <option value="asset">Asset Listing</option>
                      <option value="governance">Governance</option>
                      <option value="treasury">Treasury</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about your proposal"
                      rows={6}
                      value={newProposal.description}
                      onChange={(e) =>
                        setNewProposal({
                          ...newProposal,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="hero"
                      className="flex-1"
                      onClick={handleCreateProposal}
                    >
                      Create Proposal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                <FontAwesomeIcon icon={faFileAlt} className="text-primary" />
                <span className="text-sm text-muted-foreground">
                  Total Proposals
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">
                {governanceStats.totalProposals}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faFire} className="text-orange-500" />
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {governanceStats.activeProposals}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faUsers} className="text-blue-500" />
                <span className="text-sm text-muted-foreground">Voters</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">
                {governanceStats.totalVoters.toLocaleString()}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faVoteYea} className="text-green-500" />
                <span className="text-sm text-muted-foreground">
                  Your Voting Power
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold glow-text">
                {governanceStats.votingPower.toLocaleString()}
              </p>
            </div>
          </motion.div>

          {/* Proposals Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="passed">Passed</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-6 space-y-4">
                {proposals
                  .filter((p) => p.status === "active")
                  .map((proposal, index) => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      onVote={handleVote}
                      index={index}
                      votingPower={votingPower}
                      getStatusColor={getStatusColor}
                      getStatusIcon={getStatusIcon}
                    />
                  ))}
              </TabsContent>

              <TabsContent value="passed" className="mt-6 space-y-4">
                {proposals
                  .filter((p) => p.status === "passed")
                  .map((proposal, index) => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      onVote={handleVote}
                      index={index}
                      votingPower={votingPower}
                      getStatusColor={getStatusColor}
                      getStatusIcon={getStatusIcon}
                    />
                  ))}
              </TabsContent>

              <TabsContent value="rejected" className="mt-6 space-y-4">
                {proposals
                  .filter((p) => p.status === "rejected")
                  .map((proposal, index) => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      onVote={handleVote}
                      index={index}
                      votingPower={votingPower}
                      getStatusColor={getStatusColor}
                      getStatusIcon={getStatusIcon}
                    />
                  ))}
              </TabsContent>

              <TabsContent value="all" className="mt-6 space-y-4">
                {proposals.map((proposal, index) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    onVote={handleVote}
                    index={index}
                    votingPower={votingPower}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// Proposal Card Component
const ProposalCard = ({
  proposal,
  onVote,
  index,
  votingPower,
  getStatusColor,
  getStatusIcon,
}: {
  proposal: Proposal;
  onVote: (id: number, support: boolean) => void;
  index: number;
  votingPower: number;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => any;
}) => {
  const votesForPercent = proposal.totalVotes > 0 ? (proposal.votesFor / proposal.totalVotes) * 100 : 0;
  const quorumPercent = (proposal.totalVotes / proposal.quorum) * 100;
  const timeLeft = Math.ceil(
    (proposal.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                proposal.status
              )}`}
            >
              <FontAwesomeIcon icon={getStatusIcon(proposal.status)} className="mr-1" />
              {proposal.status.toUpperCase()}
            </span>
            <span className="text-xs text-muted-foreground">
              #{proposal.id} · {proposal.category}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2">{proposal.title}</h3>
          <p className="text-muted-foreground text-sm mb-3">
            {proposal.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span>Proposed by {proposal.proposer}</span>
            {proposal.status === "active" && (
              <span className="text-orange-500 font-medium">
                {timeLeft} days left
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Voting Stats */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">For</span>
            <span className="font-medium text-green-500">
              {proposal.votesFor.toLocaleString()} ({votesForPercent.toFixed(1)}%)
            </span>
          </div>
          <Progress value={votesForPercent} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Against</span>
            <span className="font-medium text-red-500">
              {proposal.votesAgainst.toLocaleString()} (
              {(100 - votesForPercent).toFixed(1)}%)
            </span>
          </div>
          <Progress value={100 - votesForPercent} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Quorum Progress</span>
            <span className="font-medium">
              {proposal.totalVotes.toLocaleString()} /{" "}
              {proposal.quorum.toLocaleString()} ({quorumPercent.toFixed(1)}%)
            </span>
          </div>
          <Progress value={quorumPercent} className="h-2" />
        </div>
      </div>

      {/* Vote Buttons */}
      {proposal.status === "active" && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-green-500/30 text-green-500 hover:bg-green-500/10"
            onClick={() => onVote(proposal.id, true)}
          >
            Vote For
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10"
            onClick={() => onVote(proposal.id, false)}
          >
            Vote Against
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default Governance;
