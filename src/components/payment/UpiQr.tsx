import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { PAYMENT_CONFIG } from '../../config/storeConfig';
import { Copy, Check, RefreshCw, QrCode as QrIcon, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { DiyaIcon } from '../common/DiyaIcon';

interface UpiQrProps {
  orderId: string;
  amount: number;
}

export const UpiQr: React.FC<UpiQrProps> = ({ orderId, amount }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [useStaticQr, setUseStaticQr] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const { showToast } = useToast();

  const formattedAmount = amount.toFixed(2);

  // Exact dynamic UPI URI required:
  // upi://pay?pa=diwalimart@axl&pn=Diwali%20Mart&am={TOTAL_AMOUNT}&cu=INR&tr={ORDER_ID}
  const upiUri = `upi://pay?pa=${encodeURIComponent(PAYMENT_CONFIG.upiId)}&pn=${encodeURIComponent(
    PAYMENT_CONFIG.payeeName
  )}&am=${formattedAmount}&cu=INR&tr=${encodeURIComponent(orderId)}`;

  useEffect(() => {
    let isMounted = true;
    if (PAYMENT_CONFIG.dynamicQrEnabled && !useStaticQr) {
      QRCode.toDataURL(upiUri, {
        width: 320,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
        .then(url => {
          if (isMounted) setQrDataUrl(url);
        })
        .catch(err => {
          console.error('Failed to generate dynamic UPI QR', err);
          if (isMounted) setUseStaticQr(true);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [upiUri, useStaticQr]);

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(PAYMENT_CONFIG.upiId);
    setCopied(true);
    showToast(`Copied UPI ID: ${PAYMENT_CONFIG.upiId}`, 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto text-center w-full">
      {/* Clean Festive QR Card Container */}
      <div className="w-full bg-[#18110b] text-stone-100 rounded-3xl p-6 sm:p-7 shadow-2xl border border-amber-500/30 glow-gold relative overflow-hidden mb-5">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <DiyaIcon size={22} />
          <h3 className="font-serif text-lg font-bold tracking-tight text-amber-300">
            {PAYMENT_CONFIG.payeeName}
          </h3>
        </div>

        <div className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-1 flex items-center justify-center gap-1.5">
          <QrIcon className="w-4 h-4 text-amber-400" />
          <span>Scan QR with Any UPI App</span>
        </div>

        <p className="text-[11px] text-stone-400 mb-4">
          Google Pay · PhonePe · Paytm · BHIM · Any UPI App
        </p>

        {/* Clean, Default Dynamic QR Code (No central badges or 3rd-party logos) */}
        <div className="relative mx-auto w-64 h-64 bg-white p-3 rounded-2xl flex items-center justify-center shadow-lg border-2 border-amber-500/20 mb-4">
          {useStaticQr ? (
            <img
              src={PAYMENT_CONFIG.staticQrUrl}
              alt="Diwali Mart UPI QR Code"
              className="w-full h-full object-contain"
            />
          ) : qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Diwali Mart Dynamic UPI QR Code"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-50 text-stone-500 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-600 mb-2" />
            </div>
          )}
        </div>

        {/* Amount & Auto-fill Notice */}
        <div className="pt-1 pb-2">
          <div className="text-xs text-stone-400">Total Payable</div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono tracking-tight">
            ₹{amount.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Amount &amp; Order ID are pre-filled automatically
          </div>
        </div>
      </div>

      {/* Payee Details Card */}
      <div className="w-full bg-[#1e140c] rounded-2xl p-4 border border-amber-950/60 mb-4 space-y-2 text-xs text-left shadow-md">
        <div className="flex justify-between items-center text-stone-400">
          <span>Payee Name:</span>
          <span className="text-stone-100 font-bold">{PAYMENT_CONFIG.payeeName}</span>
        </div>
        <div className="flex justify-between items-center text-stone-400">
          <span>Order ID:</span>
          <span className="font-mono text-amber-300 font-semibold">{orderId}</span>
        </div>
        <div className="flex justify-between items-center text-stone-400 pt-1 border-t border-amber-950/40">
          <span className="font-semibold text-stone-300">Exact Amount:</span>
          <span className="text-base font-extrabold text-amber-400 font-mono">
            ₹{amount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Copy UPI ID Box */}
      <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-stone-900 border border-stone-800 text-xs mb-3">
        <div className="flex flex-col text-left truncate mr-2">
          <span className="text-[10px] text-stone-500 uppercase tracking-wider">UPI ID</span>
          <span className="font-mono text-amber-300 font-semibold truncate">
            {PAYMENT_CONFIG.upiId}
          </span>
        </div>
        <button
          onClick={handleCopyUpiId}
          className="flex items-center gap-1.5 text-stone-950 bg-amber-400 hover:bg-amber-300 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors shrink-0 shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-stone-950 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy UPI ID'}</span>
        </button>
      </div>

      {/* Static / Dynamic QR Toggle */}
      <button
        onClick={() => setUseStaticQr(!useStaticQr)}
        className="text-xs text-stone-500 hover:text-stone-400 underline transition-colors"
      >
        {useStaticQr ? 'Switch to Dynamic Pre-filled QR' : 'Static QR fallback'}
      </button>
    </div>
  );
};
