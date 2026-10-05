import React from 'react';
import { useOrders } from '../context/OrderContext';
import { OrderTimeline } from '../components/payment/OrderTimeline';
import { DiyaIcon } from '../components/common/DiyaIcon';
import { ArrowLeft, Clock, MapPin, Truck, ShieldCheck, User, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

interface OrderDetailsPageProps {
  orderId: string;
  navigate: (path: string) => void;
}

export const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({
  orderId,
  navigate
}) => {
  const { getOrderById, refreshOrders } = useOrders();
  const order = getOrderById(orderId);

  // Live update if payment is verified in admin tab
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

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold font-serif text-stone-100 mb-2">Order Not Found</h2>
        <p className="text-stone-400 text-xs mb-4">The requested order was not found in your local orders registry.</p>
        <button
          onClick={() => navigate('/orders')}
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Orders</span>
      </button>

      {/* Main Order Header */}
      <div className="bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-amber-950/40 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <DiyaIcon size={16} />
              <span>Order Details</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-100 font-mono">
              {order.orderId}
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Placed on {new Date(order.dateTime).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </p>
          </div>

          <div className="flex flex-col sm:items-end">
            <span className="text-[11px] text-stone-400">Total Order Amount</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono">
              ₹{order.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Dynamic Payment & Order Status Banner */}
        {order.paymentStatus === 'verified' ? (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-emerald-200">Payment Verified · Order In Processing</div>
              <p className="text-stone-300">
                Your UPI payment has been verified by the Diwali Mart store team. Your electronic items are currently being processed for dispatch.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px] pt-0.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Estimated Delivery: {order.estimatedDelivery}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-amber-200">Payment Verification Pending</div>
              <p className="text-stone-300">
                “We have received your payment confirmation request. We will verify your payment within 5 minutes.”
              </p>
              <p className="text-stone-400 text-[11px]">
                Your order will be processed after payment verification.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Products List & Timeline (col-span-8) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Products List */}
          <div className="bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-stone-100 font-serif pb-4 border-b border-amber-950/40 mb-4">
              Purchased Electronics ({order.products.length})
            </h3>

            <div className="divide-y divide-amber-950/40">
              {order.products.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center gap-4 first:pt-0 last:pb-0">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.productName}
                    fallbackTitle={item.productName}
                    brand={item.brand}
                    className="w-16 h-16 rounded-xl object-contain bg-white p-0.5 border border-amber-950/60 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-amber-500 uppercase tracking-wider font-semibold block">
                      {item.brand}
                    </span>
                    <h4 className="text-xs sm:text-sm font-medium text-stone-200 truncate">
                      {item.productName}
                    </h4>
                    <span className="text-xs text-stone-400 font-mono">
                      Qty: {item.quantity} × ₹{item.unitPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-stone-100 font-mono">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-stone-100 font-serif pb-4 border-b border-amber-950/40 mb-4">
              Order Timeline
            </h3>
            <OrderTimeline
              paymentStatus={order.paymentStatus}
              orderStatus={order.orderStatus}
            />
          </div>
        </div>

        {/* Right Column: Customer & Delivery Address Summary (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Details */}
          <div className="bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 shadow-md text-xs space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-amber-950/40">
              <User className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold text-stone-200">Customer Details</h4>
            </div>
            <div>
              <span className="text-stone-400 block">Name:</span>
              <span className="font-semibold text-stone-100">{order.customerDetails.fullName}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Phone:</span>
              <span className="font-semibold text-stone-100">{order.customerDetails.phone}</span>
            </div>
            {order.customerDetails.email && (
              <div>
                <span className="text-stone-400 block">Email:</span>
                <span className="text-stone-100">{order.customerDetails.email}</span>
              </div>
            )}
          </div>

          {/* Delivery Address */}
          <div className="bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 shadow-md text-xs space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-amber-950/40">
              <MapPin className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold text-stone-200">Delivery Address</h4>
            </div>
            <p className="text-stone-300 leading-relaxed font-medium">
              {order.deliveryAddress.fullName}
            </p>
            <p className="text-stone-400 leading-relaxed">
              {order.deliveryAddress.houseFlatBuilding}, {order.deliveryAddress.address}, {order.deliveryAddress.area}
            </p>
            {order.deliveryAddress.landmark && (
              <p className="text-stone-400">Landmark: {order.deliveryAddress.landmark}</p>
            )}
            <p className="text-stone-300 font-mono">
              {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
            </p>
            <p className="text-stone-400 pt-1">
              Contact: {order.deliveryAddress.phone}
            </p>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 shadow-md text-xs space-y-2.5">
            <h4 className="font-bold text-stone-200 pb-2 border-b border-amber-950/40">
              Payment Summary
            </h4>
            <div className="flex justify-between text-stone-400">
              <span>Subtotal</span>
              <span className="font-mono text-stone-200">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Delivery</span>
              <span className="text-emerald-400 font-semibold uppercase text-[10px]">
                {order.delivery === 0 ? 'FREE' : `₹${order.delivery}`}
              </span>
            </div>
            <div className="pt-2 border-t border-amber-950/40 flex justify-between items-baseline font-bold">
              <span className="text-stone-200">Total Paid (UPI)</span>
              <span className="text-amber-400 text-base font-mono">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
