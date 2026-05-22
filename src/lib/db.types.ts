export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      designer_sessions: {
        Row: {
          created_at: string
          dimensions: Json
          estimate: Json
          id: string
          notes: string
          photo_urls: string[]
          room_type: Database["public"]["Enums"]["room_type"]
          selections: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          dimensions?: Json
          estimate?: Json
          id?: string
          notes?: string
          photo_urls?: string[]
          room_type?: Database["public"]["Enums"]["room_type"]
          selections?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          dimensions?: Json
          estimate?: Json
          id?: string
          notes?: string
          photo_urls?: string[]
          room_type?: Database["public"]["Enums"]["room_type"]
          selections?: Json
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          address: string
          budget: Database["public"]["Enums"]["budget_band"]
          created_at: string
          designer_session_id: string | null
          email: string
          id: string
          name: string
          notes: string
          phone: string
          photo_urls: string[]
          project_type: Database["public"]["Enums"]["project_type"]
          rooms: string[]
          scope_notes: string
          source: string
          status: Database["public"]["Enums"]["lead_status"]
          timeline: Database["public"]["Enums"]["timeline_band"]
          utm: Json
          zip: string
        }
        Insert: {
          address?: string
          budget: Database["public"]["Enums"]["budget_band"]
          created_at?: string
          designer_session_id?: string | null
          email: string
          id?: string
          name: string
          notes?: string
          phone: string
          photo_urls?: string[]
          project_type: Database["public"]["Enums"]["project_type"]
          rooms?: string[]
          scope_notes?: string
          source?: string
          status?: Database["public"]["Enums"]["lead_status"]
          timeline: Database["public"]["Enums"]["timeline_band"]
          utm?: Json
          zip: string
        }
        Update: {
          address?: string
          budget?: Database["public"]["Enums"]["budget_band"]
          created_at?: string
          designer_session_id?: string | null
          email?: string
          id?: string
          name?: string
          notes?: string
          phone?: string
          photo_urls?: string[]
          project_type?: Database["public"]["Enums"]["project_type"]
          rooms?: string[]
          scope_notes?: string
          source?: string
          status?: Database["public"]["Enums"]["lead_status"]
          timeline?: Database["public"]["Enums"]["timeline_band"]
          utm?: Json
          zip?: string
        }
        Relationships: []
      }
      materials: {
        Row: {
          category: Database["public"]["Enums"]["material_category"]
          color_hex: string
          created_at: string
          description: string
          id: string
          image_url: string
          install_cost_per_unit: number
          is_active: boolean
          name: string
          sku: string
          sort_order: number
          supplier: string
          swatch_url: string
          unit: string
          unit_cost: number
        }
        Insert: {
          category: Database["public"]["Enums"]["material_category"]
          color_hex?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          install_cost_per_unit?: number
          is_active?: boolean
          name: string
          sku?: string
          sort_order?: number
          supplier?: string
          swatch_url?: string
          unit?: string
          unit_cost?: number
        }
        Update: {
          category?: Database["public"]["Enums"]["material_category"]
          color_hex?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          install_cost_per_unit?: number
          is_active?: boolean
          name?: string
          sku?: string
          sort_order?: number
          supplier?: string
          swatch_url?: string
          unit?: string
          unit_cost?: number
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          body: string
          budget_band: Database["public"]["Enums"]["budget_band"]
          created_at: string
          duration_weeks: number | null
          gallery: Json
          hero_image: string
          id: string
          is_published: boolean
          neighborhood: string
          service_slug: string
          slug: string
          sort_order: number
          summary: string
          title: string
          year: number | null
        }
        Insert: {
          body?: string
          budget_band?: Database["public"]["Enums"]["budget_band"]
          created_at?: string
          duration_weeks?: number | null
          gallery?: Json
          hero_image?: string
          id?: string
          is_published?: boolean
          neighborhood?: string
          service_slug: string
          slug: string
          sort_order?: number
          summary?: string
          title: string
          year?: number | null
        }
        Update: {
          body?: string
          budget_band?: Database["public"]["Enums"]["budget_band"]
          created_at?: string
          duration_weeks?: number | null
          gallery?: Json
          hero_image?: string
          id?: string
          is_published?: boolean
          neighborhood?: string
          service_slug?: string
          slug?: string
          sort_order?: number
          summary?: string
          title?: string
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      budget_band:
        | "under-15k"
        | "15-35k"
        | "35-75k"
        | "75-150k"
        | "150-300k"
        | "300k-plus"
        | "unsure"
      lead_status:
        | "new"
        | "contacted"
        | "scheduled"
        | "qualified"
        | "lost"
        | "won"
      material_category:
        | "cabinet"
        | "countertop"
        | "backsplash"
        | "floor"
        | "wall-tile"
        | "fixture"
        | "hardware"
        | "paint"
        | "lighting"
      project_type:
        | "kitchen"
        | "bathroom"
        | "basement"
        | "whole-home"
        | "addition"
        | "outdoor"
        | "handyman"
        | "other"
      room_type: "kitchen" | "bathroom" | "other"
      timeline_band:
        | "asap"
        | "1-3-months"
        | "3-6-months"
        | "6-12-months"
        | "exploring"
    }
    CompositeTypes: { [_ in never]: never }
  }
}

export type MaterialRow = Database["public"]["Tables"]["materials"]["Row"]
export type DesignerSessionRow = Database["public"]["Tables"]["designer_sessions"]["Row"]
export type DesignerSessionInsert = Database["public"]["Tables"]["designer_sessions"]["Insert"]
export type DesignerSessionUpdate = Database["public"]["Tables"]["designer_sessions"]["Update"]
export type LeadRow = Database["public"]["Tables"]["leads"]["Row"]
export type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"]
export type PortfolioRow = Database["public"]["Tables"]["portfolio_projects"]["Row"]
export type MaterialCategory = Database["public"]["Enums"]["material_category"]
export type RoomType = Database["public"]["Enums"]["room_type"]
