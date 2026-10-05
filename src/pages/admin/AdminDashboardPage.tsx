import React, { useState, useEffect, useMemo } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useOrders } from '../../context/OrderContext';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { DiyaIcon } from '../../components/common/DiyaIcon';
import { useToast } from '../../context/ToastContext';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Search,
  LogOut,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Check,
  Filter,
  Eye,
  MapPin,
  ChevronDown
} from 'lucide-react';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
}

type FilterTab = 'all' | 'pending' | 'verified' | 'processing_shipped';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const { isAdminAuthenticated, adminLogout, adminSession } = useAdminAuth();
  const { orders, verifyOrderPayment, updateOrderStatus, refreshOrders } = useOrders();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);

  // Authentication Guard
  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/dm-secure-portal-9472');
    }
  }, [isAdminAuthenticated, navigate]);

  // Real-Time Admin Table Sync: Listen to 'storage' and 'diwalimart_order_placed' window events
  useEffect(() => {
    const handleOrderSync = () => {
      refreshOrders();
    };

    window.addEventListener('storage', handleOrderSync);
    window.addEventListener('diwalimart_order_placed', handleOrderSync);
    window.addEventListener('diwalimart_order_verified', handleOrderSync);

    return () => {
      window.removeEventListener('storage', handleOrderSync);
      window.removeEventListener('diwalimart_order_placed', handleOrderSync);
      window.removeEventListener('diwalimart_order_verified', handleOrderSync);
    };
  }, [refreshOrders]);

  // Statistics
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.paymentStatus === 'verification_pending').length;
    const verified = orders.filter(o => o.paymentStatus === 'verified').length;
    const processingOrShipped = orders.filter(
      o => o.orderStatus?.toLowerCase() === 'processing' || o.orderStatus === 'shipped' || o.orderStatus === 'delivered'
    ).length;
    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'verified')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return { total, pending, verified, processingOrShipped, totalRevenue };
  }, [orders]);

  // Filter & Search Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Tab filter
      if (activeTab === 'pending' && order.paymentStatus !== 'verification_pending') {
        return false;
      }
      if (activeTab === 'verified' && order.paymentStatus !== 'verified') {
        return false;
      }
      if (
        activeTab === 'processing_shipped' &&
        order.orderStatus?.toLowerCase() !== 'processing' &&
        order.orderStatus !== 'shipped' &&
        order.orderStatus !== 'delivered'
      ) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = order.orderId.toLowerCase().includes(q);
        const matchesName = order.customerDetails.fullName.toLowerCase().includes(q);
        const matchesPhone = order.customerDetails.phone.toLowerCase().includes(q);
        const matchesCity = order.deliveryAddress.city.toLowerCase().includes(q);
        const matchesProduct = order.products.some(p =>
          p.productName.toLowerCase().includes(q)
        );

        if (!matchesId && !matchesName && !matchesPhone && !matchesCity && !matchesProduct) {
          return false;
        }
      }

      return true;
    });
  }, [orders, activeTab, searchQuery]);

  // One-click Verify Payment Action with immediate localStorage write and event dispatch
  const handleConfirmPayment = (orderId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const STORAGE_KEY = 'diwalimart_demo_orders';
    let currentOrders: Order[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) currentOrders = JSON.parse(raw);
    } catch {
      currentOrders = orders;
    }
    if (!Array.isArray(currentOrders) || currentOrders.length === 0) {
      currentOrders = orders;
    }

    let updated = false;
    const updatedOrders = currentOrders.map(ord => {
      if (ord.orderId.toUpperCase() === orderId.toUpperCase()) {
        updated = true;
        return {
          ...ord,
          paymentStatus: 'verified' as PaymentStatus,
          orderStatus: (ord.orderStatus === 'order_placed' || ord.orderStatus === 'Processing' ? 'processing' : ord.orderStatus) as OrderStatus
        };
      }
      return ord;
    });

    if (updated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('diwalimart_order_verified', { detail: { orderId } }));
      refreshOrders();
      showToast(`Payment confirmed for order ${orderId}`, 'festive');
    } else {
      const success = verifyOrderPayment(orderId);
      if (success) {
        showToast(`Payment confirmed for order ${orderId}`, 'festive');
      }
    }
  };

  // Change workflow status
  const handleStatusChange = (
    orderId: string,
    newStatus: OrderStatus,
    e?: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e) e.stopPropagation();
    updateOrderStatus(orderId, newStatus);
    showToast(`Order ${orderId} updated to ${newStatus.toUpperCase()}`, 'info');
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/dm-secure-portal-9472');
  };

  return (
    <div className="min-h-screen bg-[#0d0906] text-stone-100 flex flex-col">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#160f09]/95 backdrop-blur-md border-b border-amber-950/60 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <DiyaIcon size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm sm:text-base text-stone-100">
                Diwali Mart
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-stone-950 uppercase tracking-wider">
                Admin Console
              </span>
            </div>
            <p className="text-[10px] text-stone-400 hidden sm:block">
              Connected: {adminSession?.username || 'Super Admin'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              refreshOrders();
              showToast('Refreshed latest orders from localStorage', 'info');
            }}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs flex items-center gap-1.5 transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="py-1.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">View Store</span>
          </button>

          <button
            onClick={handleLogout}
            className="py-1.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-950/60 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Orders Card */}
          <div className="bg-[#140e09] border border-amber-950/60 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Total Orders</span>
              <Package className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-100">
              {stats.total}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">Recorded in registry</div>
          </div>

          {/* Verification Pending Card */}
          <div className="bg-[#140e09] border border-amber-950/60 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-amber-400 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Verification Pending</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-300">
              {stats.pending}
            </div>
            <div className="text-[11px] text-amber-400/80 mt-1 font-medium">Requires Admin Approval</div>
          </div>

          {/* Payment Verified Card */}
          <div className="bg-[#140e09] border border-amber-950/60 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-emerald-400 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Payment Verified</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-300">
              {stats.verified}
            </div>
            <div className="text-[11px] text-emerald-400/80 mt-1">Approved for dispatch</div>
          </div>

          {/* Verified Revenue Card */}
          <div className="bg-[#140e09] border border-amber-950/60 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Verified Revenue</span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 truncate">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">From verified UPI orders</div>
          </div>
        </div>

        {/* Filter Tabs & Search Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-amber-950/50 mb-6">
          {/* 4 Required Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/50'
                  : 'bg-[#18110b] text-stone-300 hover:bg-[#22160d] border border-amber-950/60'
              }`}
            >
              All Orders ({stats.total})
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/50'
                  : 'bg-[#18110b] text-amber-400 hover:bg-[#22160d] border border-amber-950/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Verification Pending ({stats.pending})</span>
            </button>

            <button
              onClick={() => setActiveTab('verified')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'verified'
                  ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-950/50'
                  : 'bg-[#18110b] text-emerald-400 hover:bg-[#22160d] border border-amber-950/60'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Payment Verified ({stats.verified})</span>
            </button>

            <button
              onClick={() => setActiveTab('processing_shipped')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'processing_shipped'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/50'
                  : 'bg-[#18110b] text-stone-300 hover:bg-[#22160d] border border-amber-950/60'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Processing / Shipped ({stats.processingOrShipped})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by ID, customer, phone..."
              className="w-full bg-[#18110b] border border-amber-950/60 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Orders Table Container */}
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-[#140e09] border border-amber-950/60 rounded-3xl">
            <Package className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-stone-200 text-base mb-1">
              No Orders Found
            </h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              {searchQuery
                ? `No orders match your search "${searchQuery}". Try a different keyword.`
                : 'No customer orders have been recorded yet.'}
            </p>
          </div>
        ) : (
          <div className="bg-[#140e09] border border-amber-950/60 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                {/* Table Header */}
                <thead className="bg-[#1c120a] border-b border-amber-950/60 text-amber-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Order ID &amp; Date</th>
                    <th className="py-3.5 px-4">Customer Details</th>
                    <th className="py-3.5 px-4">Delivery Address</th>
                    <th className="py-3.5 px-4">Products</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Verification Action</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-amber-950/40 text-stone-300">
                  {filteredOrders.map(order => {
                    const isPending = order.paymentStatus === 'verification_pending';
                    const isVerified = order.paymentStatus === 'verified';

                    return (
                      <tr
                        key={order.orderId}
                        className="hover:bg-[#1a110a] transition-colors"
                      >
                        {/* 1. Order ID & Date */}
                        <td className="py-4 px-4 align-top">
                          <button
                            onClick={() => setSelectedOrderForModal(order)}
                            className="font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                          >
                            <span>{order.orderId}</span>
                            <Eye className="w-3 h-3 text-stone-500" />
                          </button>
                          <div className="text-[11px] text-stone-400 mt-1">
                            {new Date(order.dateTime).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-[10px] text-stone-400">
                            {new Date(order.dateTime).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>

                        {/* 2. Customer Name & Mobile */}
                        <td className="py-4 px-4 align-top">
                          <div className="font-semibold text-stone-100">
                            {order.customerDetails.fullName}
                          </div>
                          <div className="font-mono text-amber-400 text-[11px] mt-0.5">
                            {order.customerDetails.phone}
                          </div>
                          {order.customerDetails.email && (
                            <div className="text-[10px] text-stone-400 truncate max-w-[140px]">
                              {order.customerDetails.email}
                            </div>
                          )}
                        </td>

                        {/* 3. Delivery Address */}
                        <td className="py-4 px-4 align-top max-w-[200px]">
                          <div className="line-clamp-2 text-stone-300">
                            {order.deliveryAddress.houseFlatBuilding}, {order.deliveryAddress.address}
                          </div>
                          <div className="font-mono text-stone-400 text-[11px] mt-0.5">
                            {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                          </div>
                        </td>

                        {/* 4. Products Summary */}
                        <td className="py-4 px-4 align-top max-w-[200px]">
                          <div className="space-y-1">
                            {order.products.slice(0, 2).map((p, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 truncate">
                                <span className="font-mono text-amber-400 text-[11px]">
                                  {p.quantity}x
                                </span>
                                <span className="text-stone-200 truncate">{p.productName}</span>
                              </div>
                            ))}
                            {order.products.length > 2 && (
                              <div className="text-[10px] text-stone-400">
                                + {order.products.length - 2} more item(s)
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 5. Total Amount */}
                        <td className="py-4 px-4 align-top">
                          <div className="font-mono font-bold text-stone-100 text-sm">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-stone-400">UPI Payment</div>
                        </td>

                        {/* 6. Current Status & Dropdown */}
                        <td className="py-4 px-4 align-top space-y-1.5">
                          {/* Payment Status Pill */}
                          <div>
                            {isVerified ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>Verified</span>
                              </span>
                            ) : isPending ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[10px] font-semibold animate-pulse">
                                <Clock className="w-3 h-3 text-amber-400" />
                                <span>Pending Approval</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-900 text-stone-400 text-[10px]">
                                <span>{order.paymentStatus}</span>
                              </span>
                            )}
                          </div>

                          {/* Order Status Selector */}
                          <div className="pt-0.5">
                            <select
                              value={order.orderStatus}
                              onChange={e =>
                                handleStatusChange(order.orderId, e.target.value as OrderStatus)
                              }
                              className="bg-[#1f140b] border border-amber-900/40 text-stone-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-amber-500"
                            >
                              <option value="order_placed">Order Placed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </div>
                        </td>

                        {/* 7. Action Button */}
                        <td className="py-4 px-4 align-top text-right">
                          {isPending ? (
                            <button
                              onClick={e => handleConfirmPayment(order.orderId, e)}
                              className="py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-stone-950 font-bold text-xs shadow-md shadow-emerald-950/60 transition-all active:scale-95 flex items-center justify-center gap-1.5 ml-auto whitespace-nowrap"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>✓ Confirm Payment</span>
                            </button>
                          ) : (
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Payment Confirmed</span>
                              </span>
                              <button
                                onClick={() => setSelectedOrderForModal(order)}
                                className="text-[11px] text-stone-400 hover:text-amber-400 transition-colors underline"
                              >
                                View Order Details
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Order Detail Modal */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#140e09] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-amber-950/50 mb-6">
              <div>
                <span className="text-[10px] text-amber-500 uppercase tracking-wider font-bold">
                  Order Inspection
                </span>
                <h3 className="font-mono font-bold text-xl text-stone-100">
                  {selectedOrderForModal.orderId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="px-3 py-1.5 rounded-xl bg-stone-900 text-stone-400 hover:text-white text-xs"
              >
                Close ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 text-xs">
              {/* Customer & Address Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#1b120a] border border-amber-950/60 space-y-1">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">
                    Customer Information
                  </div>
                  <div className="font-bold text-stone-100 text-sm">
                    {selectedOrderForModal.customerDetails.fullName}
                  </div>
                  <div className="font-mono text-amber-400">
                    {selectedOrderForModal.customerDetails.phone}
                  </div>
                  {selectedOrderForModal.customerDetails.email && (
                    <div className="text-stone-400">
                      {selectedOrderForModal.customerDetails.email}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-[#1b120a] border border-amber-950/60 space-y-1">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">
                    Delivery Address
                  </div>
                  <div className="text-stone-200">
                    {selectedOrderForModal.deliveryAddress.houseFlatBuilding}, {selectedOrderForModal.deliveryAddress.address}
                  </div>
                  <div className="text-stone-400">
                    {selectedOrderForModal.deliveryAddress.city}, {selectedOrderForModal.deliveryAddress.state} - {selectedOrderForModal.deliveryAddress.pincode}
                  </div>
                </div>
              </div>

              {/* Items Purchased */}
              <div className="p-4 rounded-2xl bg-[#1b120a] border border-amber-950/60">
                <div className="text-[10px] text-stone-400 uppercase font-semibold mb-3">
                  Purchased Electronics ({selectedOrderForModal.products.length})
                </div>
                <div className="divide-y divide-amber-950/40">
                  {selectedOrderForModal.products.map((p, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.productName}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80';
                          }}
                          className="w-10 h-10 rounded-lg object-contain bg-white p-0.5 shrink-0"
                        />
                        <div>
                          <div className="font-medium text-stone-200 line-clamp-1">{p.productName}</div>
                          <div className="text-[10px] text-stone-400 font-mono">
                            Qty: {p.quantity} × ₹{p.unitPrice.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-stone-200">
                        ₹{(p.unitPrice * p.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Action Footer */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-stone-400 text-xs">Total Order Value</span>
                  <div className="font-mono font-bold text-xl text-amber-400">
                    ₹{selectedOrderForModal.totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                {selectedOrderForModal.paymentStatus === 'verification_pending' ? (
                  <button
                    onClick={() => {
                      handleConfirmPayment(selectedOrderForModal.orderId);
                      setSelectedOrderForModal(null);
                    }}
                    className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-lg flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Confirm Payment Now</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Payment Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
