import React, { useState, useEffect } from 'react';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { UpiQr } from '../components/payment/UpiQr';
import { UpiIntentButton } from '../components/payment/UpiIntentButton';
import { DiyaIcon } from '../components/common/DiyaIcon';
import { ShieldCheck, CheckSquare, Square, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface PaymentPageProps {
  orderId: string;
  navigate: (path: string) => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ orderId, navigate }) => {
  const { getOrderById, confirmPaymentForOrder } = useOrders();
  const { clearCart } = useCart();
  const { showToast } = useToast();

  const [hasConfirmedCheckbox, setHasConfirmedCheckbox] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showQrOnMobile, setShowQrOnMobile] = useState(false);

  const order = getOrderById(orderId);

  useEffect(() => {
    if (!order) {
      // If order not found, fallback
      const timer = setTimeout(() => {
        navigate('/orders');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [order, navigate]);

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold font-serif text-stone-100 mb-2">Order Not Found</h2>
        <p className="text-stone-400 text-xs mb-4">Redirecting you to orders...</p>
      </div>
    );
  }

  const handleConfirmPaid = () => {
    if (!hasConfirmedCheckbox) {
      showToast('Please confirm the payment acknowledgment checkbox first.', 'error');
      return;
    }

    setSubmitting(true);

    const STORAGE_KEY = 'diwalimart_demo_orders';
    let currentOrders: any[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) currentOrders = JSON.parse(raw);
    } catch {
      currentOrders = [];
    }
    if (!Array.isArray(currentOrders)) currentOrders = [];

    const existingIndex = currentOrders.findIndex(
      o => o.orderId && o.orderId.toUpperCase() === orderId.toUpperCase()
    );

    let updatedOrder: any;
    if (existingIndex >= 0) {
      updatedOrder = {
        ...currentOrders[existingIndex],
        paymentStatus: 'verification_pending',
        orderStatus: 'Processing'
      };
      currentOrders[existingIndex] = updatedOrder;
    } else if (order) {
      updatedOrder = {
        ...order,
        paymentStatus: 'verification_pending',
        orderStatus: 'Processing'
      };
      currentOrders = [updatedOrder, ...currentOrders];
    } else {
      updatedOrder = {
        orderId,
        dateTime: new Date().toISOString(),
        products: [],
        quantities: [],
        unitPrices: [],
        subtotal: 0,
        delivery: 0,
        discount: 0,
        totalAmount: 0,
        customerDetails: { fullName: 'Customer', phone: '' },
        deliveryAddress: {
          id: `addr_${Date.now()}`,
          userId: 'guest',
          fullName: 'Customer',
          phone: '',
          houseFlatBuilding: '',
          address: '',
          area: '',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        paymentMethod: 'UPI',
        paymentStatus: 'verification_pending',
        orderStatus: 'Processing',
        estimatedDelivery: '7–15 days'
      };
      currentOrders = [updatedOrder, ...currentOrders];
    }

    // Save strictly to diwalimart_demo_orders
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentOrders));

    // Update Context
    confirmPaymentForOrder(orderId);

    // Dispatch both storage and custom diwalimart_order_placed events immediately
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('diwalimart_order_placed', { detail: { order: updatedOrder } }));

    // Clear cart
    clearCart();

    showToast('Payment confirmation request submitted.', 'festive');

    setTimeout(() => {
      navigate(`/order-success/${orderId}`);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
      {/* Back button */}
      <button
        onClick={() => navigate('/checkout')}
        className="flex items-center gap-1 text-xs text-stone-400 hover:text-amber-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Review</span>
      </button>

      {/* Main Payment Card */}
      <div className="bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden glow-gold">
        {/* Header */}
        <div className="text-center pb-6 border-b border-amber-950/40 mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-amber-950/50 border border-amber-500/30 mb-3 shadow-md">
            <DiyaIcon size={28} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-100 mb-1">
            Complete Your UPI Payment
          </h1>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono my-2">
            Pay ₹{order.totalAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-stone-400">
            Order Reference: <span className="font-mono text-amber-300 font-semibold">{orderId}</span>
          </div>
        </div>

        {/* Mobile UPI Intent Section (visible on small screens) */}
        <div className="block sm:hidden mb-6">
          <UpiIntentButton
            orderId={orderId}
            amount={order.totalAmount}
            showQr={showQrOnMobile}
            onToggleQr={() => setShowQrOnMobile(!showQrOnMobile)}
          />
        </div>

        {/* Dynamic & Static QR Code Display */}
        <div className={`${showQrOnMobile ? 'block' : 'hidden sm:block'} mb-8`}>
          <UpiQr orderId={orderId} amount={order.totalAmount} />
        </div>

        {/* Payment Confirmation Acknowledgment */}
        <div className="bg-[#1a110a] border border-amber-900/40 rounded-2xl p-4 mb-6">
          <div
            onClick={() => setHasConfirmedCheckbox(!hasConfirmedCheckbox)}
            className="flex items-start gap-3 cursor-pointer select-none"
          >
            <div className="mt-0.5 text-amber-400 shrink-0">
              {hasConfirmedCheckbox ? (
                <CheckSquare className="w-5 h-5 fill-amber-500 text-stone-950" />
              ) : (
                <Square className="w-5 h-5 text-stone-500" />
              )}
            </div>
            <p className="text-xs text-stone-200 leading-relaxed">
              “I confirm that I have completed the UPI payment for the displayed amount.”
            </p>
          </div>
        </div>

        {/* Primary Payment Confirmation Button */}
        <button
          onClick={handleConfirmPaid}
          disabled={submitting}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-950/60 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span>✓ I Have Paid — Confirm Payment</span>
        </button>

        {/* Trust disclaimer */}
        <div className="mt-6 pt-4 border-t border-amber-950/40 flex items-center justify-center gap-2 text-[11px] text-stone-500 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Payment confirmation will trigger demo verification workflow within 5 minutes.</span>
        </div>
      </div>
    </div>
  );
};
