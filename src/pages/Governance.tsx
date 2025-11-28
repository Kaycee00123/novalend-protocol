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
  status: "active" | "passed" | "rejected" | "pending";
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorum: number;
  startDate: string;
  endDate: string;
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

  // Mock user voting power (based on staked NOVA tokens)
  const votingPower = 7500; // User's staked NOVA tokens

  // Mock proposals
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 1,
      title: "Increase ETH Collateral Factor to 80%",
      description:
        "Proposal to increase the collateral factor for ETH from 75% to 80%, allowing users to borrow more against their ETH deposits. This will improve capital efficiency while maintaining protocol safety.",
      proposer: "0x1234...5678",
      status: "active",
      votesFor: 125000,
      votesAgainst: 45000,
      totalVotes: 170000,
      quorum: 100000,
      startDate: "2024-03-15",
      endDate: "2024-03-22",
      category: "Risk Parameters",
    },
    {
      id: 2,
      title: "Add Support for LINK Token",
      description:
        "Proposal to add Chainlink (LINK) as a supported asset for lending and borrowing. LINK has strong liquidity and a proven track record, making it a good candidate for the protocol.",
      proposer: "0xabcd...ef01",
      status: "active",
      votesFor: 98000,
      votesAgainst: 52000,
      totalVotes: 150000,
      quorum: 100000,
      startDate: "2024-03-14",
      endDate: "2024-03-21",
      category: "Asset Listing",
    },
    {
      id: 3,
      title: "Reduce Liquidation Penalty to 5%",
      description:
        "Proposal to reduce the liquidation penalty from 8% to 5%, making the protocol more competitive with other lending platforms while still maintaining liquidator incentives.",
      proposer: "0x9876...5432",
      status: "passed",
      votesFor: 185000,
      votesAgainst: 35000,
      totalVotes: 220000,
      quorum: 100000,
      startDate: "2024-03-01",
      endDate: "2024-03-08",
      category: "Risk Parameters",
    },
    {
      id: 4,
      title: "Implement Dynamic Interest Rate Model",
      description:
        "Proposal to switch to a dynamic interest rate model that adjusts more responsively to market conditions, improving capital efficiency and yield optimization.",
      proposer: "0x5555...1111",
      status: "rejected",
      votesFor: 62000,
      votesAgainst: 128000,
      totalVotes: 190000,
      quorum: 100000,
      startDate: "2024-02-20",
      endDate: "2024-02-27",
      category: "Protocol Upgrade",
    },
  ]);

  // Governance stats
  const governanceStats = {
    totalProposals: proposals.length,
    activeProposals: proposals.filter((p) => p.status === "active").length,
    totalVoters: 12450,
    votingPower: votingPower,
  };

  const handleVote = (proposalId: number, support: boolean) => {
    if (votingPower <= 0) {
      toast.error("You need to stake NOVA tokens to vote");
      return;
    }

    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === proposalId) {
          return {
            ...p,
            votesFor: support ? p.votesFor + votingPower : p.votesFor,
            votesAgainst: !support ? p.votesAgainst + votingPower : p.votesAgainst,
            totalVotes: p.totalVotes + votingPower,
          };
        }
        return p;
      })
    );

    toast.success(
      `Voted ${support ? "FOR" : "AGAINST"} with ${votingPower.toLocaleString()} NOVA`
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

    const proposal: Proposal = {
      id: proposals.length + 1,
      title: newProposal.title,
      description: newProposal.description,
      proposer: "0x1234...5678",
      status: "pending",
      votesFor: 0,
      votesAgainst: 0,
      totalVotes: 0,
      quorum: 100000,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      category: newProposal.category,
    };

    setProposals([proposal, ...proposals]);
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
  const votePercentage =
    proposal.totalVotes > 0
      ? (proposal.votesFor / proposal.totalVotes) * 100
      : 50;
  const quorumPercentage = (proposal.totalVotes / proposal.quorum) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
    >
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                proposal.status
              )}`}
            >
              <FontAwesomeIcon
                icon={getStatusIcon(proposal.status)}
                className="mr-1"
              />
              {proposal.status.toUpperCase()}
            </span>
            <span className="text-xs text-muted-foreground">
              {proposal.category}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2">{proposal.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {proposal.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Proposer: {proposal.proposer}</span>
            <span>•</span>
            <span>
              {proposal.startDate} - {proposal.endDate}
            </span>
          </div>
        </div>
      </div>

      {/* Voting Progress */}
      <div className="space-y-4 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-green-500">
              For: {proposal.votesFor.toLocaleString()} (
              {votePercentage.toFixed(1)}%)
            </span>
            <span className="text-red-500">
              Against: {proposal.votesAgainst.toLocaleString()} (
              {(100 - votePercentage).toFixed(1)}%)
            </span>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-green-500 transition-all"
              style={{ width: `${votePercentage}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              Quorum Progress: {proposal.totalVotes.toLocaleString()} /{" "}
              {proposal.quorum.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {quorumPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={Math.min(quorumPercentage, 100)} className="h-2" />
        </div>
      </div>

      {/* Voting Buttons */}
      {proposal.status === "active" && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 text-green-500 border-green-500/30 hover:bg-green-500/10"
            onClick={() => onVote(proposal.id, true)}
            disabled={votingPower === 0}
          >
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            Vote For
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-red-500 border-red-500/30 hover:bg-red-500/10"
            onClick={() => onVote(proposal.id, false)}
            disabled={votingPower === 0}
          >
            <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
            Vote Against
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default Governance;
