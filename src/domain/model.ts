export type Sensitivity = 'ordinary' | 'private-couple' | 'explicit-intimate';
export type Category = 'other' | 'watch' | 'eat' | 'do' | 'want' | 'listen' | 'faith' | 'intimacy';
export type Domain = 'everyday' | 'playful' | 'relationship' | 'intimacy' | 'faith';
export type Status = 'saved' | 'considering' | 'done' | 'archived';
export type ReactionType = 'interested' | 'love' | 'maybe' | 'not_for_me';
export type ResponseState = 'answered' | 'passed' | 'not_now';
export interface Member { user_id: string; display_name: string; intimacy_enabled: boolean; faith_enabled: boolean }
export interface Reaction { user_id: string; reaction_type: ReactionType }
export interface SharedObject {
  id: string; created_by: string; created_at: string; kind: 'url' | 'note' | 'idea';
  title: string; body: string | null; source_url: string | null; category: Category;
  status: Status; sensitivity: Sensitivity; hidden: boolean; reactions: Reaction[];
  metadata: { source?: string; confidence?: number; enrichment?: string };
}
export interface QuestionResponse { user_id: string; state: ResponseState; answer: string | null }
export interface QuestionCard {
  id: string; created_by: string; created_at: string; prompt: string; domain: Domain;
  sensitivity: Sensitivity; state: 'open' | 'archived'; hidden: boolean;
  prompt_source: 'custom' | 'curated'; responses: QuestionResponse[];
}
export interface Snapshot {
  user: {id: string; display_name: string}; space: {id: string; created_at: string} | null;
  members: Member[]; objects: SharedObject[]; questions: QuestionCard[];
  intimacy_available: boolean; intimacy_active: boolean; faith_active: boolean;
}
