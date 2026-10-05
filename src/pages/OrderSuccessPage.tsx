import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useOrders } from '../context/OrderContext';
import { DiyaIcon } from '../components/common/DiyaIcon';
import { Check, Clock, Truck, ArrowRight, Package } from 'lucide-react';
import { OrderTimeline } from '../components/payment/OrderTimeline';

interface OrderSuccessPageProps {
  orderId: string;
  navigate: (path: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  orderId,
  navigate
}) => {
  const { getOrderById, refreshOrders } = useOrders();
  const order = getOrderById(orderId);

  useEffect(() => {
    const handleSync = () => {
      refreshOrders();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('diwalimart_order_verified', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('diwalimart_order_verified', handleSync);
    };
  }, [refreshOrders]);

  useEffect(() => {
    // Subtle festive confetti launch
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#d97706', '#dc2626', '#fbbf24']
      });
    } catch {
      // Ignore if canvas not supported
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full text-center">
      <div className="bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden glow-gold">
        {/* Success Checkmark Circle with Diya Accent */}
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-950/60 mx-auto">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>
          <div className="absolute -bottom-2 -right-2">
            <DiyaIcon size={26} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-100 mb-2">
          Order Placed Successfully
        </h1>

        {/* Order ID */}
        <div className="text-base sm:text-lg font-mono font-bold text-amber-400 mb-4">
          Order ID: {orderId}
        </div>

        {/* Payment Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-6">
          <Clock className="w-3.5 h-3.5" />
          <span>Verification Pending</span>
        </div>

        {/* Exact Required Messaging */}
        <div className="bg-[#1a110a] border border-amber-900/40 rounded-2xl p-5 mb-8 text-xs text-stone-300 space-y-2.5 text-left">
          <p className="font-medium text-amber-200">
            “We have received your payment confirmation request. We will verify your payment within 5 minutes.”
          </p>
          <div className="flex items-center gap-2 text-stone-300 font-semibold">
            <Truck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Estimated Delivery: 7–15 days</span>
          </div>
          <p className="text-stone-400 text-[11px]">
            “Your order will be processed after payment verification.”
          </p>
        </div>

        {/* Order Timeline Preview */}
        {order && (
          <div className="text-left mb-8 pb-6 border-b border-amber-950/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Progress Status
            </h3>
            <OrderTimeline
              paymentStatus={order.paymentStatus}
              orderStatus={order.orderStatus}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(`/orders/${orderId}`)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition-all flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>View My Order</span>
          </button>

          <button
            onClick={() => navigate('/shop')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
