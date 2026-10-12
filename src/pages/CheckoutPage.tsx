import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { SavedAddress, OrderItem } from '../types';
import { DiyaIcon } from '../components/common/DiyaIcon';
import {
  ShieldCheck,
  Truck,
  Plus,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Lock,
  QrCode
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface CheckoutPageProps {
  navigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { user, addresses, saveAddress } = useAuth();
  const { cart, subtotal, deliveryFee, discount, totalAmount } = useCart();
  const { createOrder } = useOrders();
  const { showToast } = useToast();

  // If cart is empty, redirect
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // If not logged in, redirect to login
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    }
  }, [user, navigate]);

  // Customer Contact Fields
  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState('');

  // Selected Address State
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.length > 0 ? addresses[0].id : null
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState<boolean>(addresses.length === 0);

  // New Address Form State
  const [newAddrFullName, setNewAddrFullName] = useState(user?.fullName || '');
  const [newAddrPhone, setNewAddrPhone] = useState(user?.phone || '');
  const [houseFlat, setHouseFlat] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  const [saveToAccount, setSaveToAccount] = useState(true);

  // Update customer fields when user object changes
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.fullName);
      if (!customerPhone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Update selected address when addresses load
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
      setIsAddingNewAddress(false);
    }
  }, [addresses, selectedAddressId]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate('/login?redirect=checkout');
      return;
    }

    let finalAddress: SavedAddress;

    if (isAddingNewAddress || addresses.length === 0) {
      if (!newAddrFullName.trim() || !newAddrPhone.trim() || !houseFlat.trim() || !streetAddress.trim() || !city.trim() || !pincode.trim()) {
        showToast('Please fill in all mandatory address fields.', 'error');
        return;
      }

      const addressData: Omit<SavedAddress, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.userId,
        fullName: newAddrFullName.trim(),
        phone: newAddrPhone.trim(),
        houseFlatBuilding: houseFlat.trim(),
        address: streetAddress.trim(),
        area: area.trim() || city.trim(),
        landmark: landmark.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        isDefault: true
      };

      if (saveToAccount) {
        finalAddress = await saveAddress(addressData);
      } else {
        finalAddress = {
          ...addressData,
          id: `temp_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
    } else {
      const found = addresses.find(a => a.id === selectedAddressId);
      if (!found) {
        showToast('Please select a valid delivery address.', 'error');
        return;
      }
      finalAddress = found;
    }

    // Convert cart items to OrderItems
    const orderItems: OrderItem[] = cart.map(item => ({
      productId: item.product.productId,
      productName: item.product.productName,
      brand: item.product.brand,
      quantity: item.quantity,
      unitPrice: item.product.diwaliPrice,
      onlineReferencePrice: item.product.referenceOnlineSalePrice,
      image: item.product.productImages[0]
    }));

    // Create the order locally
    const created = createOrder({
      items: orderItems,
      subtotal,
      delivery: deliveryFee,
      discount,
      totalAmount,
      customerDetails: {
        fullName: customerName || user.fullName,
        phone: customerPhone || user.phone,
        email: customerEmail || undefined
      },
      deliveryAddress: finalAddress
    });

    // Navigate to payment page
    navigate(`/payment/${created.orderId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
        <DiyaIcon size={16} />
        <span>Secure Checkout</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif mb-8">
        Delivery Details & Review
      </h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer details & Address (col-span-8) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Customer Details */}
          <div className="bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-amber-950/40">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="font-serif font-bold text-stone-100 text-base">
                Customer Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-stone-400 mb-1 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">
                  Email Address <span className="text-stone-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="For order receipt"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 shadow-md">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-amber-950/40">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="font-serif font-bold text-stone-100 text-base">
                  Delivery Address
                </h2>
              </div>

              {addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingNewAddress ? 'Select Saved Address' : 'Add New Address'}</span>
                </button>
              )}
            </div>

            {/* Saved Addresses Selector */}
            {!isAddingNewAddress && addresses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {addresses.map(addr => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'bg-amber-950/30 border-amber-500 shadow-md shadow-amber-950/50'
                        : 'bg-[#1a110a] border-amber-950/50 hover:border-amber-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-stone-200">{addr.fullName}</span>
                      {selectedAddressId === addr.id && (
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <p className="text-stone-400 leading-relaxed">
                      {addr.houseFlatBuilding}, {addr.address}, {addr.area}
                    </p>
                    <p className="text-stone-400 mt-1 font-mono">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-stone-400 mt-1">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}

            {/* New Address Form */}
            {(isAddingNewAddress || addresses.length === 0) && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">Recipient Name *</label>
                    <input
                      type="text"
                      required
                      value={newAddrFullName}
                      onChange={e => setNewAddrFullName(e.target.value)}
                      className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">Recipient Phone *</label>
                    <input
                      type="tel"
                      required
                      value={newAddrPhone}
                      onChange={e => setNewAddrPhone(e.target.value)}
                      className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">
                      Flat, House No., Building, Apartment *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 402, Royal Palms"
                      value={houseFlat}
                      onChange={e => setHouseFlat(e.target.value)}
                      className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">
                      Area, Street, Sector, Village *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MG Road, Indiranagar"
                      value={streetAddress}
                      onChange={e => setStreetAddress(e.target.value)}
                      className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">Landmark</label>
                    <input
                      type="text"
                      placeholder="e.g. Near City Mall"
                      value={landmark}
                      onChange={e => setLandmark(e.target.value)}
                      className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">Town / City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">6-Digit Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 400001"
                      value={pincode}
                      onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl px-3 py-2 text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                    <input
                      type="checkbox"
                      checked={saveToAccount}
                      onChange={e => setSaveToAccount(e.target.checked)}
                      className="rounded accent-amber-500 w-4 h-4"
                    />
                    <span>Save this address to my account for future Diwali shopping</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Payment Method (UPI ONLY) */}
          <div className="bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-amber-950/40">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="font-serif font-bold text-stone-100 text-base">
                Payment Method
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-100">
                    UPI Payment (Instant QR & Mobile Intent)
                  </h4>
                  <p className="text-[11px] text-stone-400">
                    Pay securely using Google Pay, PhonePe, Paytm, BHIM, or any UPI app.
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 px-2 py-1 rounded border border-amber-500/20">
                UPI ONLY
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (col-span-4) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-[#160f09] border border-amber-950/60 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="font-serif font-bold text-stone-100 text-base pb-3 border-b border-amber-950/40">
              Order Review
            </h3>

            {/* Itemized Mini List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.product.productId} className="flex items-center justify-between text-xs">
                  <div className="flex-1 pr-2 truncate">
                    <span className="font-medium text-stone-200 block truncate">
                      {item.product.productName}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Qty: {item.quantity} × ₹{item.product.diwaliPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="font-mono text-stone-300 font-semibold shrink-0">
                    ₹{(item.product.diwaliPrice * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Financials */}
            <div className="pt-3 border-t border-amber-950/40 space-y-2 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal</span>
                <span className="font-mono text-stone-200">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-stone-400">
                <span>Delivery</span>
                <span className="font-semibold text-emerald-400 uppercase text-[11px]">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="pt-2 border-t border-amber-950/40 flex justify-between items-baseline">
                <span className="text-sm font-bold text-stone-100">Total Payable</span>
                <span className="text-xl font-extrabold text-amber-400 font-mono">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-950/60 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Proceed to UPI Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Markers */}
            <div className="pt-2 border-t border-amber-950/40 space-y-2 text-[11px] text-stone-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Secure Checkout with UPI Confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Estimated Delivery: 7–15 days</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
