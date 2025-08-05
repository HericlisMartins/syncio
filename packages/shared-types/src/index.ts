// Product data structure based on the assessment requirements
export interface ProductImage {
  id: string;
  url: string;
  position: number;
  alt?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  barcode?: string;
  price: number;
  inventory_quantity: number;
  image_id?: string;
  title: string;
  weight?: number;
  grams?: number;
}

export interface Product {
  id: string;
  title: string;
  body_html?: string;
  vendor?: string;
  product_type?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  template_suffix?: string;
  tags?: string;
  status: string;
  published_scope?: string;
  admin_graphql_api_id?: string;
  images: ProductImage[];
  image?: ProductImage;
  variants: ProductVariant[];
  options?: Array<{
    id: string;
    name: string;
    position: number;
    values: string[];
  }>;
}

// Diff result types
export interface DiffResult {
  type: "added" | "removed" | "modified" | "unchanged";
  path: string;
  oldValue?: any;
  newValue?: any;
  message: string;
}

export interface ComparisonResult {
  hasChanges: boolean;
  differences: DiffResult[];
  summary: {
    added: number;
    removed: number;
    modified: number;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PayloadResponse {
  id: string;
  received_at: string;
  payload: Product;
}

// Frontend state types
export interface AppState {
  payload1: PayloadResponse | null;
  payload2: PayloadResponse | null;
  comparison: ComparisonResult | null;
  loading: boolean;
  error: string | null;
  countdown: number;
}

// Event types for real-time updates
export interface PayloadReceivedEvent {
  type: "payload_received";
  data: PayloadResponse;
}

export interface ComparisonCompletedEvent {
  type: "comparison_completed";
  data: ComparisonResult;
}

export type WebSocketEvent = PayloadReceivedEvent | ComparisonCompletedEvent;
