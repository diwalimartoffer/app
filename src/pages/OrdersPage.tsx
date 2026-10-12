import React from 'react';
import { useOrders } from '../context/OrderContext';
import { EmptyState } from '../components/common/EmptyState';
import { DiyaIcon } from '../components/common/DiyaIcon';
import { Clock, Eye, Package, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

interface OrdersPageProps {
  navigate: (path: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ navigate }) => {
  const { orders, refreshOrders } = useOrders();

  // Instant multi-tab and same-window sync when admin verifies order
  React.useEffect(() => {
    const handleSync = () => {
      refreshOrders();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('diwalimart_order_verified', handleSync);
    window.addEventListener('diwalimart_order_placed', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('diwalimart_order_verified', handleSync);
      window.removeEventListener('diwalimart_order_placed', handleSync);
    };
  }, [refreshOrders]);

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          type="orders"
          onAction={() => navigate('/shop')}
          actionText="Start Shopping"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
        <DiyaIcon size={16} />
        <span>Order History</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif mb-8">
        My Orders ({orders.length})
      </h1>

      <div className="space-y-6">
        {orders.map(order => (
          <div
            key={order.orderId}
            className="bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 shadow-xl hover:border-amber-500/40 transition-all"
          >
            {/* Order Card Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-amber-950/40 gap-3">
              <div>
                <span className="text-[11px] text-stone-400 block mb-0.5">Order Placed</span>
                <span className="font-mono text-sm font-bold text-amber-400">
                  {order.orderId}
                </span>
                <span className="text-xs text-stone-500 ml-2">
                  · {new Date(order.dateTime).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {order.paymentStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Payment Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold animate-pulse">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Verification Pending</span>
                  </span>
                )}
              </div>
            </div>

            {/* Products Thumbnails Preview */}
            <div className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-x-auto max-w-xl py-1">
                {order.products.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 shrink-0 bg-[#1b120a] p-2 rounded-xl border border-amber-950/40">
                    <ImageWithFallback
                      src={p.image}
                      alt={p.productName}
                      fallbackTitle={p.productName}
                      brand={p.brand}
                      className="w-12 h-12 rounded-lg object-contain bg-white p-0.5 shrink-0"
                    />
                    <div className="text-xs">
                      <div className="font-medium text-stone-200 line-clamp-1 max-w-[180px]">
                        {p.productName}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Qty: {p.quantity} × ₹{p.unitPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total & Detail CTA */}
              <div className="text-left sm:text-right shrink-0">
                <div className="text-xs text-stone-400">Total Order Value</div>
                <div className="text-lg font-bold text-stone-100 font-mono">
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Bottom Metadata & Button */}
            <div className="pt-4 border-t border-amber-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-stone-400 gap-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Estimated Delivery: {order.estimatedDelivery}</span>
              </div>

              <button
                onClick={() => navigate(`/orders/${order.orderId}`)}
                className="py-2 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-950/80 hover:border-amber-500/40 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
