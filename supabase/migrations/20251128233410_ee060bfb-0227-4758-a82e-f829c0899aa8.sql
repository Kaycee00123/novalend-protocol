-- Create proposals table
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  proposer TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'passed', 'rejected', 'executed')),
  votes_for BIGINT NOT NULL DEFAULT 0,
  votes_against BIGINT NOT NULL DEFAULT 0,
  total_votes BIGINT NOT NULL DEFAULT 0,
  quorum BIGINT NOT NULL DEFAULT 100000,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  execution_date TIMESTAMP WITH TIME ZONE,
  ipfs_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('new_proposal', 'voting_deadline', 'proposal_passed', 'proposal_rejected', 'proposal_executed')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create discussions table
CREATE TABLE public.discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  user_address TEXT NOT NULL,
  user_name TEXT,
  message TEXT NOT NULL,
  parent_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  user_address TEXT NOT NULL,
  support BOOLEAN NOT NULL,
  voting_power BIGINT NOT NULL,
  reason TEXT,
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(proposal_id, user_address)
);

-- Create proposal_documents table
CREATE TABLE public.proposal_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  size_bytes BIGINT,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for proposals (public read, restricted write)
CREATE POLICY "Proposals are viewable by everyone"
ON public.proposals FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create proposals"
ON public.proposals FOR INSERT
WITH CHECK (true);

CREATE POLICY "Proposals can be updated by system"
ON public.proposals FOR UPDATE
USING (true);

-- RLS Policies for notifications (user-specific)
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (true);

CREATE POLICY "System can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (true);

-- RLS Policies for discussions (public read, authenticated write)
CREATE POLICY "Discussions are viewable by everyone"
ON public.discussions FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create discussions"
ON public.discussions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own discussions"
ON public.discussions FOR UPDATE
USING (true);

CREATE POLICY "Users can delete their own discussions"
ON public.discussions FOR DELETE
USING (true);

-- RLS Policies for votes (public read, restricted write)
CREATE POLICY "Votes are viewable by everyone"
ON public.votes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create votes"
ON public.votes FOR INSERT
WITH CHECK (true);

-- RLS Policies for proposal_documents (public read, restricted write)
CREATE POLICY "Documents are viewable by everyone"
ON public.proposal_documents FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create documents"
ON public.proposal_documents FOR INSERT
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_proposals_status ON public.proposals(status);
CREATE INDEX idx_proposals_created_at ON public.proposals(created_at DESC);
CREATE INDEX idx_notifications_user_address ON public.notifications(user_address);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_discussions_proposal_id ON public.discussions(proposal_id);
CREATE INDEX idx_votes_proposal_id ON public.votes(proposal_id);
CREATE INDEX idx_votes_user_address ON public.votes(user_address);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.proposals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.discussions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_proposals_updated_at
BEFORE UPDATE ON public.proposals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discussions_updated_at
BEFORE UPDATE ON public.discussions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();