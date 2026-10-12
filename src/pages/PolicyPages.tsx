import React from 'react';
import { DiyaIcon } from '../components/common/DiyaIcon';
import { STORE_CONFIG } from '../../src/config/storeConfig';
import { Shield, RotateCcw, FileText, ArrowLeft } from 'lucide-react';

interface PolicyPageProps {
  type: 'privacy' | 'terms' | 'returns';
  navigate: (path: string) => void;
}

export const PolicyPages: React.FC<PolicyPageProps> = ({ type, navigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </button>

      <div className="bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 text-stone-300 text-xs sm:text-sm leading-relaxed">
        {type === 'privacy' && (
          <>
            <div className="flex items-center gap-3 pb-4 border-b border-amber-950/40">
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-100">
                  Privacy Policy
                </h1>
                <p className="text-xs text-stone-400">Last updated: October 2026</p>
              </div>
            </div>

            <p>
              At <strong>{STORE_CONFIG.brandName}</strong>, we respect the privacy of every festival customer. This Privacy Policy outlines the information we collect and how we utilize it to process electronics orders and deliver high-standard customer service.
            </p>

            <h3 className="text-base font-bold text-stone-100 font-serif pt-2">
              1. Information We Collect
            </h3>
            <p>
              We collect information provided directly by you during registration and checkout, including full name, Indian mobile number, delivery address (flat number, street, city, state, pincode), and optional email address.
            </p>

            <h3 className="text-base font-bold text-stone-100 font-serif pt-2">
              2. Authentication & Data Security
            </h3>
            <p>
              Customer accounts are authenticated via mobile number and password using client-side security architecture. Saved customer delivery addresses and customer profiles are stored locally in the customer's browser environment.
            </p>

            <h3 className="text-base font-bold text-stone-100 font-serif pt-2">
              3. Payment Information
            </h3>
            <p>
              {STORE_CONFIG.brandName} operates strictly on direct UPI payments (Scan & Pay / Intent). We do not store or process your bank credentials, UPI PIN, or credit card numbers on our servers.
            </p>
          </>
        )}

        {type === 'terms' && (
          <>
            <div className="flex items-center gap-3 pb-4 border-b border-amber-950/40">
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-100">
                  Terms of Service
                </h1>
                <p className="text-xs text-stone-400">Effective Date: October 2026</p>
              </div>
            </div>

            <p>
              Welcome to <strong>{STORE_CONFIG.brandName}</strong>. By accessing our platform, adding products to your festive cart, and submitting orders, you agree to comply with and be bound by the following terms.
            </p>

            <h3 className="text-base font-bold text-stone-100 font-serif pt-2">
              1. Festive Pricing & Online Reference Price
            </h3>
            <p>
              Products display a Diwali Price calculated at a 50% discount from the Online Reference Sale Price. Reference prices reflect historical online retail benchmarks and do not constitute mandatory retail price representations.
            </p>

            <h3 className="text-base font-bold text-stone-100 font-serif pt-2">
              2. UPI Payment & Manual Verification
            </h3>
            <p>
              Payment confirmation requests submitted via "I Have Paid" enter a <strong>Payment Verification Pending</strong> state. Verification is performed within 5 minutes. Submitting confirmation does not automatically guarantee shipment until the payment transaction has completed.
            </p>

            <h3 className="text-base font-bold text-stone-100 font-serif pt-2">
              3. Delivery Timeline
            </h3>
            <p>
              Estimated delivery across India is 7 to 15 business days depending on customer delivery location and festival postal volumes.
            </p>
          </>
        )}

        {type === 'returns' && (
          <>
            <div className="flex items-center gap-3 pb-4 border-b border-amber-950/40">
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-100">
                  Returns & Replacement Policy
                </h1>
                <p className="text-xs text-stone-400">Diwali 2026 Policy</p>
              </div>
            </div>

            <p>
              At <strong>{STORE_CONFIG.brandName}</strong>, we ensure that every festival gadget reaches you in factory-sealed condition.
            </p>

            <h3 className="text-base font-bold text-stone-100 font-serif pt-2">
              1. 7-Day Replacement Guarantee
            </h3>
            <p>
              If your electronics item is delivered with physical transit damage, defective components, or incorrect technical specifications, you are eligible for a free replacement within 7 calendar days of delivery.
            </p>

            <h3 className="text-base font-bold text-stone-100 font-serif pt-2">
              2. Brand Warranty Support
            </h3>
            <p>
              All electronics include their official manufacturer brand warranty (1–3 years as detailed on the product page). Authorized service centers honor hardware servicing upon presentation of your Diwali Mart order confirmation.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
