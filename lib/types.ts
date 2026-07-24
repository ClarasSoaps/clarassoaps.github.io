export type ScentFamily =
  | "floral"
  | "citrus"
  | "woody"
  | "fresh"
  | "sweet"
  | "minty";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  ingredients: string;
  benefits: string[];
  scentFamily: ScentFamily[];
  seasonal: boolean;
  bestseller: boolean;
  inStock: boolean;
}

// Shape must stay identical to the old site's localStorage entries
// (key 'clarasSoapCart') so returning visitors' carts survive.
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
}

export interface ProductFilters {
  seasonal?: boolean;
  bestseller?: boolean;
  scentFamily?: ScentFamily[];
  inStock?: boolean;
}
