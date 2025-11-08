/**
 * Database Type Definitions
 * Generated from Supabase schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      candidates: {
        Row: {
          id: number;
          name: string;
          slug: string;
          photo_url: string;
          party: string | null;
          motto: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: never;
          name: string;
          slug: string;
          photo_url: string;
          party?: string | null;
          motto?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          photo_url?: string;
          party?: string | null;
          motto?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      candidate_meta: {
        Row: {
          candidate_id: number;
          bio: string | null;
          website: string | null;
          twitter: string | null;
          facebook: string | null;
          instagram: string | null;
          youtube: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          candidate_id: number;
          bio?: string | null;
          website?: string | null;
          twitter?: string | null;
          facebook?: string | null;
          instagram?: string | null;
          youtube?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          bio?: string | null;
          website?: string | null;
          twitter?: string | null;
          facebook?: string | null;
          instagram?: string | null;
          youtube?: string | null;
          updated_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          candidate_id: number;
          country: string | null;
          region: string | null;
          submitted_ip: string | null;
          user_agent: string | null;
          status: string;
          media_code: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: number;
          country?: string | null;
          region?: string | null;
          submitted_ip?: string | null;
          user_agent?: string | null;
          status?: string;
          media_code?: string | null;
          created_at?: string;
        };
        Update: {
          status?: string;
        };
      };
      media_referrers: {
        Row: {
          id: string;
          code: string;
          label: string;
          organization: string | null;
          country: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          label: string;
          organization?: string | null;
          country?: string | null;
          created_at?: string;
        };
        Update: {
          label?: string;
          organization?: string | null;
          country?: string | null;
        };
      };
    };
    Views: {
      vote_aggregates: {
        Row: {
          candidate_id: number;
          candidate_name: string;
          candidate_slug: string;
          photo_url: string;
          total_votes: number;
          percentage: number;
        };
      };
      vote_by_country: {
        Row: {
          country: string;
          candidate_slug: string;
          candidate_name: string;
          total_votes: number;
        };
      };
    };
    Functions: {
      refresh_vote_aggregates: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
  };
  private: {
    Tables: {
      voters: {
        Row: {
          id: string;
          normalized_name: string;
          dob: string;
          phone_e164: string;
          phone_verified_at: string | null;
          vote_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          normalized_name: string;
          dob: string;
          phone_e164: string;
          phone_verified_at?: string | null;
          vote_id?: string | null;
          created_at?: string;
        };
        Update: {
          phone_verified_at?: string | null;
          vote_id?: string | null;
        };
      };
      otps: {
        Row: {
          id: string;
          phone_e164: string;
          code_hash: string;
          submission_id: string;
          expires_at: string;
          attempts: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone_e164: string;
          code_hash: string;
          submission_id: string;
          expires_at: string;
          attempts?: number;
          created_at?: string;
        };
        Update: {
          attempts?: number;
        };
      };
      fraud_logs: {
        Row: {
          id: string;
          event_type: string;
          severity: 'low' | 'medium' | 'high';
          ip_address: string | null;
          phone_e164: string | null;
          device_fingerprint: string | null;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type: string;
          severity: 'low' | 'medium' | 'high';
          ip_address?: string | null;
          phone_e164?: string | null;
          device_fingerprint?: string | null;
          details?: Json | null;
          created_at?: string;
        };
        Update: never;
      };
    };
  };
}
