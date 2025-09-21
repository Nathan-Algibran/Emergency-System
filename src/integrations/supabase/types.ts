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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      contacts: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean
          location: string | null
          order_index: number
          position: string
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          location?: string | null
          order_index?: number
          position: string
          start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          location?: string | null
          order_index?: number
          position?: string
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      patient_history: {
        Row: {
          created_at: string
          diagnosis: string | null
          dokter_id: string | null
          id: string
          patient_id: string
          status: Database["public"]["Enums"]["patient_status"]
          tindakan: string | null
          updated_at: string
          waktu_update: string
        }
        Insert: {
          created_at?: string
          diagnosis?: string | null
          dokter_id?: string | null
          id?: string
          patient_id: string
          status?: Database["public"]["Enums"]["patient_status"]
          tindakan?: string | null
          updated_at?: string
          waktu_update?: string
        }
        Update: {
          created_at?: string
          diagnosis?: string | null
          dokter_id?: string | null
          id?: string
          patient_id?: string
          status?: Database["public"]["Enums"]["patient_status"]
          tindakan?: string | null
          updated_at?: string
          waktu_update?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_history_dokter_id_fkey"
            columns: ["dokter_id"]
            isOneToOne: false
            referencedRelation: "system_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_history_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          alamat: string | null
          created_at: string
          id: string
          jenis_kelamin: Database["public"]["Enums"]["gender"]
          nama: string
          no_hp: string | null
          updated_at: string
          usia: number
          waktu_datang: string
        }
        Insert: {
          alamat?: string | null
          created_at?: string
          id?: string
          jenis_kelamin: Database["public"]["Enums"]["gender"]
          nama: string
          no_hp?: string | null
          updated_at?: string
          usia: number
          waktu_datang?: string
        }
        Update: {
          alamat?: string | null
          created_at?: string
          id?: string
          jenis_kelamin?: Database["public"]["Enums"]["gender"]
          nama?: string
          no_hp?: string | null
          updated_at?: string
          usia?: number
          waktu_datang?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string
          github_url: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          phone: string | null
          portfolio_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          demo_url: string | null
          description: string
          featured: boolean
          github_url: string | null
          id: string
          image_url: string | null
          order_index: number
          technologies: string[]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          demo_url?: string | null
          description: string
          featured?: boolean
          github_url?: string | null
          id?: string
          image_url?: string | null
          order_index?: number
          technologies?: string[]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          demo_url?: string | null
          description?: string
          featured?: boolean
          github_url?: string | null
          id?: string
          image_url?: string | null
          order_index?: number
          technologies?: string[]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_users: {
        Row: {
          created_at: string
          id: string
          nama_user: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          nama_user: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          nama_user?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      triage: {
        Row: {
          created_at: string
          denyut_nadi: number
          id: string
          kategori_triage: Database["public"]["Enums"]["triage_category"]
          keluhan_utama: string
          patient_id: string
          perawat_id: string
          suhu_tubuh: number
          tekanan_darah_diastolic: number
          tekanan_darah_systolic: number
          tingkat_kesadaran: Database["public"]["Enums"]["consciousness_level"]
          updated_at: string
          waktu_input: string
        }
        Insert: {
          created_at?: string
          denyut_nadi: number
          id?: string
          kategori_triage: Database["public"]["Enums"]["triage_category"]
          keluhan_utama: string
          patient_id: string
          perawat_id: string
          suhu_tubuh: number
          tekanan_darah_diastolic: number
          tekanan_darah_systolic: number
          tingkat_kesadaran: Database["public"]["Enums"]["consciousness_level"]
          updated_at?: string
          waktu_input?: string
        }
        Update: {
          created_at?: string
          denyut_nadi?: number
          id?: string
          kategori_triage?: Database["public"]["Enums"]["triage_category"]
          keluhan_utama?: string
          patient_id?: string
          perawat_id?: string
          suhu_tubuh?: number
          tekanan_darah_diastolic?: number
          tekanan_darah_systolic?: number
          tingkat_kesadaran?: Database["public"]["Enums"]["consciousness_level"]
          updated_at?: string
          waktu_input?: string
        }
        Relationships: [
          {
            foreignKeyName: "triage_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "triage_perawat_id_fkey"
            columns: ["perawat_id"]
            isOneToOne: false
            referencedRelation: "system_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      consciousness_level: "sadar" | "somnolen" | "sopor" | "koma"
      gender: "L" | "P"
      patient_status: "menunggu" | "sedang_ditangani" | "selesai"
      triage_category: "merah" | "kuning" | "hijau" | "hitam"
      user_role: "perawat" | "dokter" | "admin"
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
  public: {
    Enums: {
      consciousness_level: ["sadar", "somnolen", "sopor", "koma"],
      gender: ["L", "P"],
      patient_status: ["menunggu", "sedang_ditangani", "selesai"],
      triage_category: ["merah", "kuning", "hijau", "hitam"],
      user_role: ["perawat", "dokter", "admin"],
    },
  },
} as const
