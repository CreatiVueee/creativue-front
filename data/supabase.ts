export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
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
          client_id: number
          created_at: string
          extra_notes: string | null
          extra_notes_etc: string | null
          id: number
          industries: string[]
          input_type: string
          logo_file_url: string[] | null
          target_ages: string[] | null
          target_description: string | null
          target_gender: string | null
          target_interests: string[] | null
          target_jobs: string | null
          target_market: string | null
          target_region: string[] | null
          updated_at: string
        }
        Insert: {
          brand_core_keywords: string[]
          brand_identity: string
          brand_image: string
          brand_name: string
          brand_story: string
          client_id: number
          created_at?: string
          extra_notes?: string | null
          extra_notes_etc?: string | null
          id?: number
          industries: string[]
          input_type: string
          logo_file_url?: string[] | null
          target_ages?: string[] | null
          target_description?: string | null
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
          client_id?: number
          created_at?: string
          extra_notes?: string | null
          extra_notes_etc?: string | null
          id?: number
          industries?: string[]
          input_type?: string
          logo_file_url?: string[] | null
          target_ages?: string[] | null
          target_description?: string | null
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
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          email: string
          id: number
          interested_fields: string[]
          login_id: string
          password_hash: string
          phone_number: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          interested_fields: string[]
          login_id: string
          password_hash: string
          phone_number: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          interested_fields?: string[]
          login_id?: string
          password_hash?: string
          phone_number?: string
        }
        Relationships: []
      }
      freelancers: {
        Row: {
          certification_urls: string[] | null
          created_at: string
          email: string
          experience_years: string | null
          id: number
          main_expertise: string[] | null
          nickname: string
          phone_number: string
          profile_url: string
          role: string
          updated_at: string | null
        }
        Insert: {
          certification_urls?: string[] | null
          created_at?: string
          email: string
          experience_years?: string | null
          id?: number
          main_expertise?: string[] | null
          nickname: string
          phone_number: string
          profile_url: string
          role: string
          updated_at?: string | null
        }
        Update: {
          certification_urls?: string[] | null
          created_at?: string
          email?: string
          experience_years?: string | null
          id?: number
          main_expertise?: string[] | null
          nickname?: string
          phone_number?: string
          profile_url?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
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
          id?: number
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
          freelancer_id: number
          project_id: number
        }
        Insert: {
          applied_at: string
          created_at?: string
          freelancer_id: number
          project_id: number
        }
        Update: {
          applied_at?: string
          created_at?: string
          freelancer_id?: number
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
          },
        ]
      }
      project_submissions: {
        Row: {
          additional_description: string | null
          color_system_rationale: string | null
          created_at: string
          freelancer_id: number
          id: number
          is_selected: boolean
          layout_rationale: string | null
          portfolio_file_url: string
          project_id: number
          tone_and_manner: string | null
        }
        Insert: {
          additional_description?: string | null
          color_system_rationale?: string | null
          created_at?: string
          freelancer_id: number
          id?: number
          is_selected?: boolean
          layout_rationale?: string | null
          portfolio_file_url: string
          project_id: number
          tone_and_manner?: string | null
        }
        Update: {
          additional_description?: string | null
          color_system_rationale?: string | null
          created_at?: string
          freelancer_id?: number
          id?: number
          is_selected?: boolean
          layout_rationale?: string | null
          portfolio_file_url?: string
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
          },
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
          reference_image_url: string[]
          required_content: string[]
          reward_amount: number
          title: string
        }
        Insert: {
          additional_info?: string | null
          brand_id: number
          content_categories: string[]
          content_purpose: string[]
          created_at?: string
          deadline_date: string
          differentiation_point: string
          id?: number
          is_ai_allowed: boolean
          paid_amount: number
          price_range: string
          qc_count?: number | null
          reference_image_url: string[]
          required_content: string[]
          reward_amount: number
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
          reference_image_url?: string[]
          required_content?: string[]
          reward_amount?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
