// User types
export interface User {
  id: string;
  email: string;
  name: string;
}

// Product types
export interface SizeStock {
  size: string;
  inStock: number;
}
export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  sizes?: SizeStock[];
  brand?: string;
  discount?: number;
}

// Cart types
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

// Order types
export interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  shippingAddress: {
    name: string;
    address: string;
    phone: string;
  };
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// Shipping address type
export interface ShippingAddress {
  name: string;
  address: string;
  phone: string;
}
