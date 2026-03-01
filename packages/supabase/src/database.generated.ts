export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: "admin" | "customer";
          avatar_url: string | null;
          marketing_consent: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: "admin" | "customer";
          avatar_url?: string | null;
          marketing_consent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: "admin" | "customer";
          avatar_url?: string | null;
          marketing_consent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          category_id: string;
          subcategory_id: string | null;
          name: string;
          slug: string;
          short_description: string;
          description: string;
          story: string | null;
          sustainability_info: string | null;
          care_instructions: string | null;
          sku: string | null;
          price: number;
          compare_at_price: number | null;
          product_type: "ready_stock" | "made_to_order" | "custom_request_enabled";
          status: "draft" | "published" | "archived";
          lead_time_days: number | null;
          is_featured: boolean;
          is_best_seller: boolean;
          is_limited_edition: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          category_id: string;
          subcategory_id?: string | null;
          name: string;
          slug: string;
          short_description: string;
          description: string;
          story?: string | null;
          sustainability_info?: string | null;
          care_instructions?: string | null;
          sku?: string | null;
          price: number;
          compare_at_price?: number | null;
          product_type?: "ready_stock" | "made_to_order" | "custom_request_enabled";
          status?: "draft" | "published" | "archived";
          lead_time_days?: number | null;
          is_featured?: boolean;
          is_best_seller?: boolean;
          is_limited_edition?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          category_id?: string;
          subcategory_id?: string | null;
          name?: string;
          slug?: string;
          short_description?: string;
          description?: string;
          story?: string | null;
          sustainability_info?: string | null;
          care_instructions?: string | null;
          sku?: string | null;
          price?: number;
          compare_at_price?: number | null;
          product_type?: "ready_stock" | "made_to_order" | "custom_request_enabled";
          status?: "draft" | "published" | "archived";
          lead_time_days?: number | null;
          is_featured?: boolean;
          is_best_seller?: boolean;
          is_limited_edition?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      subcategories: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          slug: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          slug?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      inventory_stock: {
        Row: {
          id: string;
          product_id: string | null;
          variant_id: string | null;
          quantity: number;
          low_stock_threshold: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          variant_id?: string | null;
          quantity?: number;
          low_stock_threshold?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          variant_id?: string | null;
          quantity?: number;
          low_stock_threshold?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      inventory_adjustments: {
        Row: {
          id: string;
          inventory_stock_id: string;
          admin_id: string;
          reason: string;
          delta: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          inventory_stock_id: string;
          admin_id: string;
          reason: string;
          delta: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          inventory_stock_id?: string;
          admin_id?: string;
          reason?: string;
          delta?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
