import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Order, OrderItem, SavedAddress, OrderCustomerDetails, PaymentStatus, OrderStatus } from '../types';

interface CreateOrderParams {
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  discount: number;
  totalAmount: number;
  customerDetails: OrderCustomerDetails;
  deliveryAddress: SavedAddress;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (params: CreateOrderParams) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  confirmPaymentForOrder: (orderId: string) => boolean;
  verifyOrderPayment: (orderId: string) => boolean;
  updateOrderStatus: (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => boolean;
  refreshOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Standardized single localStorage key across customer checkout, success pages, and admin portal
export const ORDERS_STORAGE_KEY = 'diwalimart_demo_orders';

export function generateOrderId(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `DM-${randomNum}`;
}

// 1 Initial Pending Sample Order so the admin table is never blank during local testing
export const INITIAL_PENDING_SAMPLE_ORDER: Order = {
  orderId: 'DM-894102',
  dateTime: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  products: [
    {
      productId: 'DM-SM-002',
      productName: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)',
      brand: 'Samsung',
      quantity: 1,
      unitPrice: 64999,
      onlineReferencePrice: 129999,
      image: 'https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/y/s/g/-original-imahgfmy2zgqvjmy.jpeg'
    }
  ],
  quantities: [1],
  unitPrices: [64999],
  subtotal: 64999,
  delivery: 0,
  discount: 0,
  totalAmount: 64999,
  customerDetails: {
    fullName: 'Vikramaditya Sharma',
    phone: '+919820112233',
    email: 'vikram.sharma@example.com'
  },
  deliveryAddress: {
    id: 'addr_demo_1',
    userId: 'usr_demo_1',
    fullName: 'Vikramaditya Sharma',
    phone: '+919820112233',
    houseFlatBuilding: 'Flat 402, Royal Palms Residency',
    address: 'Near Bandra Kurla Complex',
    area: 'Bandra East',
    landmark: 'Opposite City Center',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    isDefault: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString()
  },
  paymentMethod: 'UPI',
  paymentStatus: 'verification_pending',
  orderStatus: 'Processing',
  estimatedDelivery: '7–15 days'
};

export function loadOrdersFromStorage(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // If empty or missing, seed 1 initial pending sample order so the admin table is never blank
    const fallbackOrders = [INITIAL_PENDING_SAMPLE_ORDER];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(fallbackOrders));
    return fallbackOrders;
  } catch {
    return [INITIAL_PENDING_SAMPLE_ORDER];
  }
}

export function saveOrdersToStorage(orders: Order[]): void {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders to localStorage:', err);
  }
}

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(loadOrdersFromStorage);

  const refreshOrders = useCallback(() => {
    const loaded = loadOrdersFromStorage();
    setOrders(loaded);
  }, []);

  // Listen for storage events (multi-tab sync) and custom in-tab events (diwalimart_order_placed, diwalimart_order_verified)
  useEffect(() => {
    const handleStorageChange = (e: Event) => {
      if (e instanceof StorageEvent) {
        if (e.key && e.key !== ORDERS_STORAGE_KEY) return;
      }
      refreshOrders();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('diwalimart_order_placed', handleStorageChange);
    window.addEventListener('diwalimart_order_verified', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('diwalimart_order_placed', handleStorageChange);
      window.removeEventListener('diwalimart_order_verified', handleStorageChange);
    };
  }, [refreshOrders]);

  const createOrder = ({
    items,
    subtotal,
    delivery,
    discount,
    totalAmount,
    customerDetails,
    deliveryAddress
  }: CreateOrderParams): Order => {
    const orderId = generateOrderId();
    const newOrder: Order = {
      orderId,
      dateTime: new Date().toISOString(),
      products: items,
      quantities: items.map(i => i.quantity),
      unitPrices: items.map(i => i.unitPrice),
      subtotal,
      delivery,
      discount,
      totalAmount,
      customerDetails,
      deliveryAddress,
      paymentMethod: 'UPI',
      paymentStatus: 'verification_pending',
      orderStatus: 'Processing',
      estimatedDelivery: '7–15 days'
    };

    let currentOrders: Order[] = [];
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (raw) currentOrders = JSON.parse(raw);
    } catch {
      currentOrders = orders;
    }
    if (!Array.isArray(currentOrders)) currentOrders = [];

    const updated = [newOrder, ...currentOrders.filter(o => o.orderId !== orderId)];
    saveOrdersToStorage(updated);
    setOrders(updated);

    // Dispatch events immediately so open tabs and components detect the new order instantly
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('diwalimart_order_placed', { detail: { order: newOrder } }));

    return newOrder;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    const memoryOrder = orders.find(o => o.orderId.toUpperCase() === orderId.toUpperCase());
    if (memoryOrder) return memoryOrder;

    // Fallback direct read from localStorage
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (raw) {
        const stored: Order[] = JSON.parse(raw);
        if (Array.isArray(stored)) {
          return stored.find(o => o.orderId.toUpperCase() === orderId.toUpperCase());
        }
      }
    } catch {
      // Ignore
    }
    return undefined;
  };

  const confirmPaymentForOrder = (orderId: string): boolean => {
    let currentOrders: Order[] = [];
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (raw) currentOrders = JSON.parse(raw);
    } catch {
      currentOrders = orders;
    }
    if (!Array.isArray(currentOrders)) currentOrders = [];

    let updated = false;
    let targetOrder: Order | null = null;
    const next = currentOrders.map(ord => {
      if (ord.orderId.toUpperCase() === orderId.toUpperCase()) {
        updated = true;
        targetOrder = {
          ...ord,
          paymentStatus: 'verification_pending' as PaymentStatus,
          orderStatus: 'Processing' as OrderStatus
        };
        return targetOrder;
      }
      return ord;
    });

    if (updated && targetOrder) {
      saveOrdersToStorage(next);
      setOrders(next);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('diwalimart_order_placed', { detail: { order: targetOrder } }));
    }
    return updated;
  };

  // Admin one-click verify payment action
  const verifyOrderPayment = (orderId: string): boolean => {
    let currentOrders: Order[] = [];
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (raw) currentOrders = JSON.parse(raw);
    } catch {
      currentOrders = orders;
    }
    if (!Array.isArray(currentOrders)) currentOrders = [];

    let updated = false;
    let targetOrder: Order | null = null;
    const next = currentOrders.map(ord => {
      if (ord.orderId.toUpperCase() === orderId.toUpperCase()) {
        updated = true;
        targetOrder = {
          ...ord,
          paymentStatus: 'verified' as PaymentStatus,
          orderStatus: (ord.orderStatus === 'order_placed' || ord.orderStatus === 'Processing' ? 'processing' : ord.orderStatus) as OrderStatus
        };
        return targetOrder;
      }
      return ord;
    });

    if (updated && targetOrder) {
      saveOrdersToStorage(next);
      setOrders(next);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('diwalimart_order_verified', { detail: { orderId } }));
      return true;
    }
    return false;
  };

  // Update order workflow status (processing / shipped / delivered)
  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    paymentStatus?: PaymentStatus
  ): boolean => {
    let currentOrders: Order[] = [];
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (raw) currentOrders = JSON.parse(raw);
    } catch {
      currentOrders = orders;
    }
    if (!Array.isArray(currentOrders)) currentOrders = [];

    let updated = false;
    const next = currentOrders.map(ord => {
      if (ord.orderId.toUpperCase() === orderId.toUpperCase()) {
        updated = true;
        return {
          ...ord,
          orderStatus: status,
          paymentStatus: paymentStatus || ord.paymentStatus
        };
      }
      return ord;
    });

    if (updated) {
      saveOrdersToStorage(next);
      setOrders(next);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('diwalimart_order_verified', { detail: { orderId } }));
    }
    return updated;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        confirmPaymentForOrder,
        verifyOrderPayment,
        updateOrderStatus,
        refreshOrders
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export function useOrders(): OrderContextType {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
