export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      banner: {
        Row: {
          badge_text: string | null
          created_at: string
          description: string | null
          id: number
          image: string | null
          main_title: string | null
          sort_order: number
          sub_title: string | null
        }
        Insert: {
          badge_text?: string | null
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          main_title?: string | null
          sort_order: number
          sub_title?: string | null
        }
        Update: {
          badge_text?: string | null
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          main_title?: string | null
          sort_order?: number
          sub_title?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          brand_core_keywords: string[]
          brand_identity: string
          brand_image: string
          brand_name: string
          brand_story: string
          client_id: string
          created_at: string
          extra_notes: string | null
          extra_notes_etc: string | null
          id: number
          industries: string[]
          input_type: string
          logo_file_url: string[] | null
          target_ages: string[] | null
          target_gender: string | null
          target_interests: string[] | null
          target_jobs: string | null
          target_market: string | null
          target_region: string[] | null
          updated_at: string
        }
        Insert: {
          brand_core_keywords?: string[]
          brand_identity: string
          brand_image: string
          brand_name: string
          brand_story: string
          client_id: string
          created_at?: string
          extra_notes?: string | null
          extra_notes_etc?: string | null
          id?: number
          industries?: string[]
          input_type: string
          logo_file_url?: string[] | null
          target_ages?: string[] | null
          target_gender?: string | null
          target_interests?: string[] | null
          target_jobs?: string | null
          target_market?: string | null
          target_region?: string[] | null
          updated_at?: string
        }
        Update: {
          brand_core_keywords?: string[]
          brand_identity?: string
          brand_image?: string
          brand_name?: string
          brand_story?: string
          client_id?: string
          created_at?: string
          extra_notes?: string | null
          extra_notes_etc?: string | null
          id?: number
          industries?: string[]
          input_type?: string
          logo_file_url?: string[] | null
          target_ages?: string[] | null
          target_gender?: string | null
          target_interests?: string[] | null
          target_jobs?: string | null
          target_market?: string | null
          target_region?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      clients: {
        Row: {
          created_at: string
          id: string
          interested_fields: string[]
        }
        Insert: {
          created_at?: string
          id: string
          interested_fields?: string[]
        }
        Update: {
          created_at?: string
          id?: string
          interested_fields?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "clients_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      freelancers: {
        Row: {
          certification_urls: string[] | null
          created_at: string
          experience_years: string | null
          id: string
          main_expertise: string[] | null
          nickname: string
          profile_url: string
          role: string
          updated_at: string | null
        }
        Insert: {
          certification_urls?: string[] | null
          created_at?: string
          experience_years?: string | null
          id: string
          main_expertise?: string[] | null
          nickname: string
          profile_url: string
          role: string
          updated_at?: string | null
        }
        Update: {
          certification_urls?: string[] | null
          created_at?: string
          experience_years?: string | null
          id?: string
          main_expertise?: string[] | null
          nickname?: string
          profile_url?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "freelancers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      menus: {
        Row: {
          created_at: string
          id: number
          is_visible: boolean
          link_url: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id: number
          is_visible: boolean
          link_url: string
          name: string
          sort_order: number
        }
        Update: {
          created_at?: string
          id?: number
          is_visible?: boolean
          link_url?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      project_applicants: {
        Row: {
          applied_at: string
          created_at: string
          freelancer_id: string
          project_id: number
        }
        Insert: {
          applied_at?: string
          created_at?: string
          freelancer_id: string
          project_id: number
        }
        Update: {
          applied_at?: string
          created_at?: string
          freelancer_id?: string
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_applicants_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_applicants_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      project_submissions: {
        Row: {
          additional_description: string | null
          color_system_rationale: string | null
          created_at: string
          freelancer_id: string
          id: number
          is_selected: boolean
          layout_rationale: string | null
          portfolio_file_urls: string[]
          project_id: number
          tone_and_manner: string | null
        }
        Insert: {
          additional_description?: string | null
          color_system_rationale?: string | null
          created_at?: string
          freelancer_id: string
          id?: number
          is_selected?: boolean
          layout_rationale?: string | null
          portfolio_file_urls?: string[]
          project_id: number
          tone_and_manner?: string | null
        }
        Update: {
          additional_description?: string | null
          color_system_rationale?: string | null
          created_at?: string
          freelancer_id?: string
          id?: number
          is_selected?: boolean
          layout_rationale?: string | null
          portfolio_file_urls?: string[]
          project_id?: number
          tone_and_manner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_submissions_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_submissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          additional_info: string | null
          brand_id: number
          content_categories: string[]
          content_purpose: string[]
          created_at: string
          deadline_date: string
          differentiation_point: string
          id: number
          is_ai_allowed: boolean
          paid_amount: number
          price_range: string
          qc_count: number | null
          reference_image_url: string[] | null
          required_content: string[]
          reward_amount: number
          status: string
          title: string
        }
        Insert: {
          additional_info?: string | null
          brand_id: number
          content_categories?: string[]
          content_purpose?: string[]
          created_at?: string
          deadline_date: string
          differentiation_point: string
          id?: number
          is_ai_allowed?: boolean
          paid_amount?: number
          price_range: string
          qc_count?: number | null
          reference_image_url?: string[] | null
          required_content?: string[]
          reward_amount?: number
          status?: string
          title: string
        }
        Update: {
          additional_info?: string | null
          brand_id?: number
          content_categories?: string[]
          content_purpose?: string[]
          created_at?: string
          deadline_date?: string
          differentiation_point?: string
          id?: number
          is_ai_allowed?: boolean
          paid_amount?: number
          price_range?: string
          qc_count?: number | null
          reference_image_url?: string[] | null
          required_content?: string[]
          reward_amount?: number
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          phone_number: string | null
          user_id: string | null
          user_type: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          phone_number?: string | null
          user_id?: string | null
          user_type: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          phone_number?: string | null
          user_id?: string | null
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
