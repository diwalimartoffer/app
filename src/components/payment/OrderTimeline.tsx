import React from 'react';
import { CheckCircle2, Clock, Package, Truck, Home } from 'lucide-react';
import { PaymentStatus, OrderStatus } from '../../types';

interface OrderTimelineProps {
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  paymentStatus,
  orderStatus
}) => {
  const steps = [
    {
      title: 'Order Placed',
      description: 'Order created in Diwali Mart demo registry',
      status: 'completed'
    },
    {
      title: 'Payment Verification',
      description:
        paymentStatus === 'verified'
          ? 'Payment confirmed'
          : 'Payment confirmation submitted — verification pending',
      status: paymentStatus === 'verified' ? 'completed' : 'in_progress'
    },
    {
      title: 'Payment Verified',
      description:
        paymentStatus === 'verified'
          ? 'Verified by Diwali Mart Admin — Approved for dispatch'
          : 'Pending administrator payment review',
      status: paymentStatus === 'verified' ? 'completed' : 'upcoming'
    },
    {
      title: 'Processing',
      description: 'Packaging electronics with festive care',
      status: orderStatus === 'processing' || orderStatus === 'shipped' || orderStatus === 'delivered' ? 'completed' : 'upcoming'
    },
    {
      title: 'Shipped',
      description: 'Dispatched via premium courier partner',
      status: orderStatus === 'shipped' || orderStatus === 'delivered' ? 'completed' : 'upcoming'
    },
    {
      title: 'Delivered',
      description: 'Estimated delivery: 7–15 days',
      status: orderStatus === 'delivered' ? 'completed' : 'upcoming'
    }
  ];

  return (
    <div className="py-4">
      <div className="relative border-l-2 border-amber-950/60 ml-4 pl-6 space-y-6">
        {steps.map((step, idx) => {
          const isDone = step.status === 'completed';
          const isCurrent = step.status === 'in_progress';

          return (
            <div key={idx} className="relative">
              {/* Node Marker */}
              <div
                className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                  isDone
                    ? 'bg-amber-500 border-amber-400 text-stone-950 shadow-md shadow-amber-950/50'
                    : isCurrent
                    ? 'bg-amber-950 border-amber-500 text-amber-400 animate-pulse'
                    : 'bg-stone-900 border-stone-800 text-stone-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                ) : isCurrent ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <span className="text-[10px] font-mono">{idx + 1}</span>
                )}
              </div>

              {/* Step Content */}
              <div>
                <div className="flex items-center gap-2">
                  <h4
                    className={`text-xs sm:text-sm font-semibold ${
                      isDone
                        ? 'text-stone-100'
                        : isCurrent
                        ? 'text-amber-300 font-bold'
                        : 'text-stone-500'
                    }`}
                  >
                    {step.title}
                  </h4>
                  {isCurrent && (
                    <span className="text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                      Verification Pending
                    </span>
                  )}
                  {step.status === 'upcoming' && (
                    <span className="text-[10px] text-stone-500 font-mono">
                      (Upcoming)
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
