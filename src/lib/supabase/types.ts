export type LeadInterest = "marketing" | "digital" | "courses" | "other";

export type LeadInsert = {
  name: string;
  email: string;
  company?: string | null;
  interest?: LeadInterest | null;
  message?: string | null;
  locale?: string | null;
  source?: string | null;
};

export type CourseWaitlistInsert = {
  email: string;
  name?: string | null;
  locale?: string | null;
  course_interest?: string | null;
};

export type GameScoreInsert = {
  player_name?: string | null;
  score: number;
  locale?: string | null;
};

export type ConsultaPathInterest = "service" | "courses" | "advisory";

export type ConsultaLeadInsert = {
  business_type: string;
  stage: string;
  bottleneck: string;
  revenue_range: string;
  delegation: string;
  tried_before: string;
  priority_90d: string;
  budget_quarter: string;
  name: string;
  email: string;
  whatsapp: string;
  zone: string;
  locale?: string | null;
  source?: string | null;
  cal_booked?: boolean;
  path_interest?: ConsultaPathInterest | null;
  raw?: Record<string, unknown> | null;
};

export type LeadRow = LeadInsert & {
  id: string;
  created_at: string;
};

export type CourseWaitlistRow = CourseWaitlistInsert & {
  id: string;
  created_at: string;
};

export type GameScoreRow = GameScoreInsert & {
  id: string;
  created_at: string;
};

export type ConsultaLeadRow = ConsultaLeadInsert & {
  id: string;
  created_at: string;
};

/** Minimal Database shape for typed inserts; expand when generating from Supabase CLI. */
export type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: LeadInsert;
        Update: Partial<LeadInsert>;
        Relationships: [];
      };
      course_waitlist: {
        Row: CourseWaitlistRow;
        Insert: CourseWaitlistInsert;
        Update: Partial<CourseWaitlistInsert>;
        Relationships: [];
      };
      game_scores: {
        Row: GameScoreRow;
        Insert: GameScoreInsert;
        Update: Partial<GameScoreInsert>;
        Relationships: [];
      };
      leads_consulta: {
        Row: ConsultaLeadRow;
        Insert: ConsultaLeadInsert;
        Update: Partial<ConsultaLeadInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
