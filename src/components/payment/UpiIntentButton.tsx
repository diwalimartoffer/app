import React from 'react';
import { PAYMENT_CONFIG } from '../../config/storeConfig';
import { Smartphone, QrCode } from 'lucide-react';

interface UpiIntentButtonProps {
  orderId: string;
  amount: number;
  onToggleQr: () => void;
  showQr: boolean;
}

export const UpiIntentButton: React.FC<UpiIntentButtonProps> = ({
  orderId,
  amount,
  onToggleQr,
  showQr
}) => {
  const formattedAmount = amount.toFixed(2);
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(PAYMENT_CONFIG.upiId)}&pn=${encodeURIComponent(
    PAYMENT_CONFIG.payeeName
  )}&am=${formattedAmount}&cu=INR&tr=${encodeURIComponent(orderId)}`;

  const handleOpenUpiApp = () => {
    // Attempt opening UPI intent deep-link
    window.location.href = upiIntentUri;
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
      {/* Primary Mobile UPI Intent Button */}
      <button
        onClick={handleOpenUpiApp}
        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-sm shadow-xl shadow-amber-950/60 transition-all flex items-center justify-center gap-2"
      >
        <Smartphone className="w-4 h-4" />
        <span>Pay ₹{amount.toLocaleString('en-IN')} with UPI</span>
      </button>

      {/* Toggle QR Code Fallback */}
      <button
        onClick={onToggleQr}
        className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <QrCode className="w-4 h-4 text-amber-400" />
        <span>{showQr ? 'Hide QR Code' : 'Scan QR Instead'}</span>
      </button>
    </div>
  );
};
