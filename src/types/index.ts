export interface ProductSpecification {
  [key: string]: string;
}

export interface Product {
  productId: string;
  productName: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  shortDescription: string;
  referenceOnlineSalePrice: number;
  diwaliPrice: number;
  currency: string;
  productImages: string[];
  rating: number;
  reviewCount: number;
  availability: 'in_stock' | 'limited_stock' | 'out_of_stock';
  stockQuantity: number;
  warranty: string;
  specifications: ProductSpecification;
  highlights: string[];
  sourceName: string;
  sourceUrl: string;
  sourceCheckedAt: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  isMegaDeal?: boolean;
  isTrending?: boolean;
  isPopularPick?: boolean;
  isLimitedTime?: boolean;
}

export interface UserProfile {
  userId: string;
  fullName: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedAddress {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  houseFlatBuilding: string;
  address: string;
  area: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentStatus = 'not_started' | 'confirmation_submitted' | 'verification_pending' | 'verified';
export type OrderStatus = 'order_placed' | 'processing' | 'Processing' | 'shipped' | 'delivered';

export interface OrderCustomerDetails {
  fullName: string;
  phone: string;
  email?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  onlineReferencePrice: number;
  image: string;
}

export interface Order {
  orderId: string; // DM-XXXXXX
  dateTime: string;
  products: OrderItem[];
  quantities: number[];
  unitPrices: number[];
  subtotal: number;
  delivery: number;
  discount: number;
  totalAmount: number;
  customerDetails: OrderCustomerDetails;
  deliveryAddress: SavedAddress;
  paymentMethod: 'UPI';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  estimatedDelivery: string;
}

export interface PaymentConfig {
  upiId: string;
  payeeName: string;
  staticQrUrl: string;
  dynamicQrEnabled: boolean;
  upiIntentEnabled: boolean;
  currency: string;
}

export interface StoreConfig {
  brandName: string;
  tagline: string;
  announcementText: string;
  defaultCurrency: string;
  defaultDeliveryFee: number;
  defaultDiscount: number;
  categories: {
    name: string;
    slug: string;
    icon: string;
    description: string;
  }[];
}
