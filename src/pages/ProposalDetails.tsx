import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faMoon,
  faSun,
  faHome,
  faChartLine,
  faGift,
  faVoteYea,
  faArrowLeft,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faUser,
  faCalendar,
  faChartBar,
  faComments,
  faFileAlt,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow, format } from "date-fns";
import { NotificationBell } from "@/components/NotificationBell";

interface Proposal {
  id: string;
  title: string;
  description: string;
  category: string;
  proposer: string;
  status: string;
  votes_for: number;
  votes_against: number;
  total_votes: number;
  quorum: number;
  start_date: string;
  end_date: string;
  execution_date: string | null;
  created_at: string;
}

interface Discussion {
  id: string;
  user_address: string;
  user_name: string | null;
  message: string;
  created_at: string;
  parent_id: string | null;
}

interface Vote {
  id: string;
  user_address: string;
  support: boolean;
  voting_power: number;
  reason: string | null;
  created_at: string;
}

interface Document {
  id: string;
  name: string;
  url: string;
  file_type: string;
  created_at: string;
}

const ProposalDetails = () => {
  const { proposalId } = useParams<{ proposalId: string }>();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : false;
  });

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [newComment, setNewComment] = useState("");
  const [votingPower] = useState(7500); // Mock voting power
  const [userAddress] = useState("0x1234...5678"); // Mock user address
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    if (!proposalId) {
      navigate("/governance");
      return;
    }

    fetchProposalData();
    subscribeToUpdates();
  }, [proposalId]);

  const fetchProposalData = async () => {
    if (!proposalId) return;

    setLoading(true);

    // Fetch proposal
    const { data: proposalData, error: proposalError } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", proposalId)
      .single();

    if (proposalError) {
      console.error("Error fetching proposal:", proposalError);
      toast.error("Failed to load proposal");
      navigate("/governance");
      return;
    }

    setProposal(proposalData);

    // Fetch discussions
    const { data: discussionsData } = await supabase
      .from("discussions")
      .select("*")
      .eq("proposal_id", proposalId)
      .is("parent_id", null)
      .order("created_at", { ascending: false });

    setDiscussions(discussionsData || []);

    // Fetch votes
    const { data: votesData } = await supabase
      .from("votes")
      .select("*")
      .eq("proposal_id", proposalId)
      .order("created_at", { ascending: false });

    setVotes(votesData || []);

    // Fetch documents
    const { data: documentsData } = await supabase
      .from("proposal_documents")
      .select("*")
      .eq("proposal_id", proposalId)
      .order("created_at", { ascending: false });

    setDocuments(documentsData || []);

    setLoading(false);
  };

  const subscribeToUpdates = () => {
    if (!proposalId) return;

    const channel = supabase
      .channel(`proposal-${proposalId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "discussions",
          filter: `proposal_id=eq.${proposalId}`,
        },
        () => fetchProposalData()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
          filter: `proposal_id=eq.${proposalId}`,
        },
        () => fetchProposalData()
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "proposals",
          filter: `id=eq.${proposalId}`,
        },
        () => fetchProposalData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleVote = async (support: boolean) => {
    if (!proposalId || !proposal) return;

    if (votingPower <= 0) {
      toast.error("You need to stake NOVA tokens to vote");
      return;
    }

    const { error } = await supabase.from("votes").insert({
      proposal_id: proposalId,
      user_address: userAddress,
      support,
      voting_power: votingPower,
    });

    if (error) {
      if (error.code === "23505") {
        toast.error("You have already voted on this proposal");
      } else {
        toast.error("Failed to submit vote");
      }
      return;
    }

    // Update proposal vote counts
    const newVotesFor = support ? proposal.votes_for + votingPower : proposal.votes_for;
    const newVotesAgainst = !support
      ? proposal.votes_against + votingPower
      : proposal.votes_against;

    await supabase
      .from("proposals")
      .update({
        votes_for: newVotesFor,
        votes_against: newVotesAgainst,
        total_votes: newVotesFor + newVotesAgainst,
      })
      .eq("id", proposalId);

    toast.success(`Voted ${support ? "FOR" : "AGAINST"} with ${votingPower.toLocaleString()} NOVA`);
  };

  const handlePostComment = async () => {
    if (!proposalId || !newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    const { error } = await supabase.from("discussions").insert({
      proposal_id: proposalId,
      user_address: userAddress,
      user_name: userAddress,
      message: newComment,
    });

    if (error) {
      toast.error("Failed to post comment");
      return;
    }

    setNewComment("");
    toast.success("Comment posted successfully");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-primary bg-primary/10 border-primary/30";
      case "passed":
        return "text-green-500 bg-green-500/10 border-green-500/30";
      case "rejected":
        return "text-red-500 bg-red-500/10 border-red-500/30";
      case "executed":
        return "text-blue-500 bg-blue-500/10 border-blue-500/30";
      default:
        return "text-orange-500 bg-orange-500/10 border-orange-500/30";
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
      default:
        return faClock;
    }
  };

  const toggleTheme = () => setIsDark(!isDark);

  if (loading || !proposal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading proposal...</p>
        </div>
      </div>
    );
  }

  const votePercentageFor =
    proposal.total_votes > 0 ? (proposal.votes_for / proposal.total_votes) * 100 : 0;
  const quorumProgress = (proposal.total_votes / proposal.quorum) * 100;

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
              <NotificationBell userAddress={userAddress} />
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
        <div className="container mx-auto max-w-6xl space-y-6">
          {/* Back Button */}
          <Link to="/governance">
            <Button variant="ghost" size="sm">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Governance
            </Button>
          </Link>

          {/* Proposal Header */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={`${getStatusColor(proposal.status)} border`}>
                    <FontAwesomeIcon icon={getStatusIcon(proposal.status)} className="mr-2" />
                    {proposal.status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{proposal.category}</Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{proposal.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} />
                    <span>{proposal.proposer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>
                      {formatDistanceToNow(new Date(proposal.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Voting Section */}
            {proposal.status === "active" && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 text-green-500 border-green-500/30 hover:bg-green-500/10"
                    onClick={() => handleVote(true)}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                    Vote For
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-500 border-red-500/30 hover:bg-red-500/10"
                    onClick={() => handleVote(false)}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                    Vote Against
                  </Button>
                </div>
              </div>
            )}

            {/* Vote Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Votes For</p>
                <p className="text-2xl font-bold text-green-500">
                  {proposal.votes_for.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {votePercentageFor.toFixed(1)}%
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Votes Against</p>
                <p className="text-2xl font-bold text-red-500">
                  {proposal.votes_against.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(100 - votePercentageFor).toFixed(1)}%
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Quorum Progress</p>
                <p className="text-2xl font-bold">{quorumProgress.toFixed(1)}%</p>
                <Progress value={quorumProgress} className="mt-2" />
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Started: {format(new Date(proposal.start_date), "MMM dd, yyyy")}
                </span>
                <span className="text-muted-foreground">
                  Ends: {format(new Date(proposal.end_date), "MMM dd, yyyy")}
                </span>
              </div>
              {proposal.execution_date && (
                <div className="text-sm text-muted-foreground">
                  Executed: {format(new Date(proposal.execution_date), "MMM dd, yyyy HH:mm")}
                </div>
              )}
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="details">
                <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="discussion">
                <FontAwesomeIcon icon={faComments} className="mr-2" />
                Discussion ({discussions.length})
              </TabsTrigger>
              <TabsTrigger value="votes">
                <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                Votes ({votes.length})
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="mt-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Proposal Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{proposal.description}</p>

                {documents.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Related Documents</h3>
                    <div className="space-y-2">
                      {documents.map((doc) => (
                        <a
                          key={doc.id}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <FontAwesomeIcon icon={faFileAlt} className="text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.file_type}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Discussion Tab */}
            <TabsContent value="discussion" className="mt-6 space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Add Comment</h2>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your thoughts on this proposal..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                  />
                  <Button onClick={handlePostComment}>
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                    Post Comment
                  </Button>
                </div>
              </Card>

              {discussions.length === 0 ? (
                <Card className="p-8 text-center">
                  <FontAwesomeIcon icon={faComments} className="text-4xl text-muted-foreground/20 mb-2" />
                  <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {discussions.map((discussion) => (
                    <Card key={discussion.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faUser} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium">{discussion.user_name || discussion.user_address}</p>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{discussion.message}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Votes Tab */}
            <TabsContent value="votes" className="mt-6">
              {votes.length === 0 ? (
                <Card className="p-8 text-center">
                  <FontAwesomeIcon icon={faChartBar} className="text-4xl text-muted-foreground/20 mb-2" />
                  <p className="text-muted-foreground">No votes yet</p>
                </Card>
              ) : (
                <Card className="overflow-hidden">
                  <ScrollArea className="h-[500px]">
                    <div className="divide-y divide-border">
                      {votes.map((vote) => (
                        <div key={vote.id} className="p-4 hover:bg-muted/20 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <FontAwesomeIcon icon={faUser} className="text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{vote.user_address}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(vote.created_at), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                className={vote.support ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}
                              >
                                {vote.support ? "FOR" : "AGAINST"}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-1">
                                {vote.voting_power.toLocaleString()} NOVA
                              </p>
                            </div>
                          </div>
                          {vote.reason && (
                            <p className="mt-2 text-sm text-muted-foreground pl-13">{vote.reason}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ProposalDetails;
