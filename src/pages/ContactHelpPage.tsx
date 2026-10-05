import React, { useState, useEffect } from 'react';
import { DiyaIcon } from '../components/common/DiyaIcon';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import {
  Mail,
  Clock,
  Check,
  Copy,
  Send,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageSquare,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  ExternalLink,
  FileText
} from 'lucide-react';

interface ContactHelpPageProps {
  navigate: (path: string) => void;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const GOOGLE_SUPPORT_FORM_BASE_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSf_g9gJM6GVjWTLzeC0_eCV3ObsOkJVxwoAPtdSEDPxXqvq5g/viewform';

// Pre-filled Google Support Form URL Generator using official entry IDs
export function buildPrefilledGoogleFormUrl(params: {
  fullName?: string;
  mobileNumber?: string;
  orderId?: string;
  issueCategory?: string;
  message?: string;
}): string {
  const queryParams = new URLSearchParams();
  queryParams.set('usp', 'pp_url');

  if (params.fullName?.trim()) {
    queryParams.set('entry.1964774563', params.fullName.trim());
  }
  if (params.mobileNumber?.trim()) {
    queryParams.set('entry.1769849869', params.mobileNumber.trim());
  }
  if (params.orderId?.trim()) {
    queryParams.set('entry.1443548874', params.orderId.trim().toUpperCase());
  }
  if (params.issueCategory?.trim()) {
    queryParams.set('entry.1308477966', params.issueCategory.trim());
  }
  if (params.message?.trim()) {
    queryParams.set('entry.611842854', params.message.trim());
  }

  return `${GOOGLE_SUPPORT_FORM_BASE_URL}?${queryParams.toString()}`;
}

const FAQS: FaqItem[] = [
  {
    id: 'track-order',
    category: 'Orders & Tracking',
    question: 'How do I track my order?',
    answer:
      'You can track your order at any time by navigating to the "My Orders" tab from the top navigation bar or directly visiting /orders. Each order displays its unique reference ID (e.g. DM-894102), live payment status, and order progress timeline spanning Order Placed → Verification Pending → Payment Verified → Processing → Shipped → Delivered.'
  },
  {
    id: 'upi-verification',
    category: 'Payments',
    question: 'How does UPI payment verification work?',
    answer:
      'After completing payment via your preferred UPI app (Google Pay, PhonePe, Paytm, or BHIM) using our on-screen QR code or UPI Intent, check the confirmation box and click "✓ I Have Paid — Confirm Payment". Our automated order ledger immediately records your submission under "Verification Pending", and our operations desk confirms the UPI transaction reference within 5 minutes, automatically approving your order for dispatch.'
  },
  {
    id: 'delivery-timelines',
    category: 'Shipping',
    question: 'What are the delivery timelines & festive shipping details?',
    answer:
      'All festive electronics orders are processed swiftly within 24 hours of payment verification. Standard express delivery takes between 7 to 15 business days across India. All shipments are packed in heavy-duty, tamper-evident shock-absorbent packaging and dispatched through trusted national courier partners with full transit insurance.'
  },
  {
    id: 'warranty-returns',
    category: 'Returns & Warranty',
    question: 'What is the return, replacement & warranty policy?',
    answer:
      'We offer an exclusive 7-day festive replacement guarantee for any transit damages, hardware defects, or dead-on-arrival items reported upon delivery. Furthermore, every electronic product sold on Diwali Mart includes 100% genuine brand manufacturer warranty (1 to 2 years depending on the brand), honored at any authorized service center across India with your GST invoice.'
  }
];

export const ContactHelpPage: React.FC<ContactHelpPageProps> = ({ navigate }) => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const { orders } = useOrders();

  // FAQ Accordion State
  const [openFaqId, setOpenFaqId] = useState<string | null>('track-order');

  // Contact Form State (Auto-populates if customer is logged in or has active orders)
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [mobileNumber, setMobileNumber] = useState(user?.phone || '');
  const [orderId, setOrderId] = useState(orders[0]?.orderId || '');
  const [queryTopic, setQueryTopic] = useState('Order Tracking & Status');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const SUPPORT_EMAIL = 'supportdiwalimart@gmail.com';

  // Keep fields synchronized with user state if loaded asynchronously
  useEffect(() => {
    if (user?.fullName && !fullName) {
      setFullName(user.fullName);
    }
    if (user?.phone && !mobileNumber) {
      setMobileNumber(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (orders.length > 0 && !orderId) {
      setOrderId(orders[0].orderId);
    }
  }, [orders]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopiedEmail(true);
      showToast('Support email copied to clipboard!', 'info');
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      showToast(SUPPORT_EMAIL, 'info');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !mobileNumber.trim()) {
      showToast('Please provide your name and mobile number.', 'error');
      return;
    }

    setIsSubmitting(true);

    const prefilledUrl = buildPrefilledGoogleFormUrl({
      fullName,
      mobileNumber,
      orderId,
      issueCategory: queryTopic,
      message
    });

    showToast('Opening pre-filled Google Support Form...', 'festive');

    setTimeout(() => {
      setIsSubmitting(false);
      // Clean safe navigation into a new tab
      const anchor = document.createElement('a');
      anchor.href = prefilledUrl;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }, 400);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Page Title & Breadcrumb Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
          <DiyaIcon size={16} />
          <span>Customer Support & Assistance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-stone-100 mb-4 tracking-tight">
          Contact Us & Help Center
        </h1>
        <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
          Need assistance with your festive electronics purchase, UPI payment verification, order delivery, or product warranty? Our dedicated support desk is here to help you.
        </p>
      </div>

      {/* Top 3 Support Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card 1: Official Email */}
        <div className="bg-[#140e09] border border-amber-950/60 hover:border-amber-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden transition-all flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-950/70 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-md group-hover:scale-105 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-amber-500/80 uppercase tracking-widest block mb-1">
              Official Support Email
            </span>
            <h3 className="text-lg font-bold text-stone-100 font-serif mb-1 truncate">
              {SUPPORT_EMAIL}
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-6">
              Write to us directly with your order reference or product inquiries for priority response.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-amber-950/40">
            <button
              onClick={handleCopyEmail}
              className="flex-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copy Email</span>
                </>
              )}
            </button>

            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Diwali%20Mart%20Customer%20Inquiry`}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-950/40 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Mail Us</span>
            </a>
          </div>
        </div>

        {/* Card 2: Dedicated Support Timing */}
        <div className="bg-[#140e09] border border-amber-950/60 hover:border-amber-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden transition-all flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-950/70 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-md group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-amber-500/80 uppercase tracking-widest block mb-1">
              Dedicated Support Timing
            </span>
            <h3 className="text-lg font-bold text-stone-100 font-serif mb-1">
              10:00 AM – 7:00 PM
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Monday to Saturday (Special extended coverage active during Diwali festival sale).
            </p>
          </div>

          <div className="pt-4 border-t border-amber-950/40">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Support Desk Live & Active</span>
            </div>
          </div>
        </div>

        {/* Card 3: Social Media Channels (Icons Only) */}
        <div className="bg-[#140e09] border border-amber-950/60 hover:border-amber-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden transition-all flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-950/70 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-md group-hover:scale-105 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-amber-500/80 uppercase tracking-widest block mb-1">
              Community & Social
            </span>
            <h3 className="text-lg font-bold text-stone-100 font-serif mb-1">
              Follow Our Official Handles
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-6">
              Stay updated with daily flash deal announcements, festive giveaways, and tech launches.
            </p>
          </div>

          {/* Social Icons Row (Minimalist Icons Only) */}
          <div className="pt-4 border-t border-amber-950/40 flex items-center justify-between">
            <a
              href="#"
              onClick={e => e.preventDefault()}
              className="w-10 h-10 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/60 text-stone-300 hover:text-amber-400 hover:bg-amber-950/30 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
              title="Instagram"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>

            <a
              href="#"
              onClick={e => e.preventDefault()}
              className="w-10 h-10 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/60 text-stone-300 hover:text-amber-400 hover:bg-amber-950/30 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
              title="X (Twitter)"
              aria-label="X (Twitter)"
            >
              <Twitter className="w-5 h-5" />
            </a>

            <a
              href="#"
              onClick={e => e.preventDefault()}
              className="w-10 h-10 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/60 text-stone-300 hover:text-amber-400 hover:bg-amber-950/30 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
              title="Facebook"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>

            <a
              href="#"
              onClick={e => e.preventDefault()}
              className="w-10 h-10 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/60 text-stone-300 hover:text-amber-400 hover:bg-amber-950/30 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
              title="YouTube"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Layout: FAQs (Left) and Drop Us a Message Form with Google Form Integration (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Quick Help Topics / FAQ Accordions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-100">
                Frequently Asked Questions
              </h2>
            </div>
            <p className="text-xs text-stone-400 mb-6">
              Quick answers to common questions regarding UPI payments, order tracking, and delivery.
            </p>

            {/* Accordion Items */}
            <div className="space-y-3">
              {FAQS.map(faq => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isOpen
                        ? 'bg-[#1b120a] border-amber-500/40 shadow-md'
                        : 'bg-[#110c08] border-amber-950/40 hover:border-amber-950/80'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 select-none cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-stone-200">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-amber-400 transition-transform duration-300 shrink-0 ${
                          isOpen ? 'rotate-180 text-amber-300' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs text-stone-300 leading-relaxed border-t border-amber-950/30 pt-3 space-y-2">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Fast Quick Links Strip */}
            <div className="mt-8 pt-6 border-t border-amber-950/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => navigate('/orders')}
                className="p-3 rounded-xl bg-stone-900/60 hover:bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Track Active Order</span>
                </div>
                <span className="text-stone-500">→</span>
              </button>

              <button
                onClick={() => navigate('/returns')}
                className="p-3 rounded-xl bg-stone-900/60 hover:bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Returns & Warranty</span>
                </div>
                <span className="text-stone-500">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Google Support Form Card with On-Page Pre-Fill & Direct Link (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-[#140e09] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Card Header with Trust Badge */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-amber-950/40 mb-5 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <DiyaIcon size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-serif text-stone-100">
                    Drop Us a Message
                  </h2>
                  <span className="text-[10px] text-amber-400 font-mono">
                    Fast Ticket Submission
                  </span>
                </div>
              </div>

              {/* Official Google Support Portal Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Official Google Support Portal</span>
              </div>
            </div>

            <p className="text-xs text-stone-400 mb-5 leading-relaxed">
              Fill in your details below to open our official support ticket with all fields pre-filled, or click the direct portal button.
            </p>

            {/* Direct Secondary Action Button */}
            <div className="mb-6">
              <a
                href={GOOGLE_SUPPORT_FORM_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:border-amber-400 group shadow-sm"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Direct Google Support Form</span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300 transition-colors" />
              </a>
            </div>

            <div className="relative flex py-1 items-center mb-5">
              <div className="flex-grow border-t border-amber-950/50"></div>
              <span className="flex-shrink mx-3 text-[10px] text-stone-500 uppercase tracking-widest font-mono">
                or pre-fill below
              </span>
              <div className="flex-grow border-t border-amber-950/50"></div>
            </div>

            {/* Pre-fill On-Page Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Your Full Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#1b120a] border border-amber-950/60 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Mobile Number <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={e => setMobileNumber(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-[#1b120a] border border-amber-950/60 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Order ID */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-stone-300">
                    Order ID <span className="text-stone-500 text-[10px]">(Optional)</span>
                  </label>
                  {orders.length > 0 && (
                    <span className="text-[10px] text-amber-500/80">
                      Auto-detected from active order
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  placeholder="e.g. DM-894102"
                  className="w-full bg-[#1b120a] border border-amber-950/60 rounded-xl px-3.5 py-2.5 text-xs font-mono text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Issue Category Dropdown */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Issue Category <span className="text-amber-400">*</span>
                </label>
                <select
                  value={queryTopic}
                  onChange={e => setQueryTopic(e.target.value)}
                  className="w-full bg-[#1b120a] border border-amber-950/60 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="Order Tracking & Status">Order Tracking & Status</option>
                  <option value="UPI Payment Verification">UPI Payment Verification</option>
                  <option value="Product Specifications">Product Specifications</option>
                  <option value="Delivery Timeline">Delivery Timeline</option>
                  <option value="Warranty & Replacement">Warranty & Replacement</option>
                  <option value="Other Feedback / Inquiry">Other Feedback / Inquiry</option>
                </select>
              </div>

              {/* Detailed Message / Query */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Detailed Message / Query
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Briefly describe your request or question..."
                  className="w-full bg-[#1b120a] border border-amber-950/60 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Primary Action Button: Submit Ticket / Open Support Form */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-xl shadow-amber-950/50 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'Preparing Ticket...'
                    : 'Submit Ticket / Open Support Form'}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-950" />
              </button>
            </form>

            {/* Security & Support Note */}
            <div className="mt-5 p-3.5 rounded-2xl bg-[#1b120a] border border-amber-950/50 flex items-start gap-2.5 text-[11px] text-stone-400 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                Responses submitted through our official Google Support Form are recorded directly by our team at{' '}
                <span className="text-amber-300 font-mono font-medium">
                  {SUPPORT_EMAIL}
                </span>
                . Our desk is active Mon–Sat (10 AM – 7 PM).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactHelpPage;
