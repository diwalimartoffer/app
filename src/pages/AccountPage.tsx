import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { DiyaIcon } from '../components/common/DiyaIcon';
import {
  User,
  Phone,
  MapPin,
  Package,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Edit2
} from 'lucide-react';
import { SavedAddress } from '../types';

interface AccountPageProps {
  navigate: (path: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ navigate }) => {
  const { user, addresses, logout, saveAddress, deleteAddress, updateProfileName } = useAuth();
  const { orders } = useOrders();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.fullName || '');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  // New Address Modal fields
  const [addrFullName, setAddrFullName] = useState(user?.fullName || '');
  const [addrPhone, setAddrPhone] = useState(user?.phone || '');
  const [houseFlat, setHouseFlat] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif text-stone-100 mb-2">Sign In to Your Account</h2>
        <p className="text-stone-400 text-xs mb-6">
          Access your saved festival delivery addresses, active orders, and profile details.
        </p>
        <button
          onClick={() => navigate('/login?redirect=account')}
          className="px-6 py-3 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-950/40"
        >
          Sign In with Mobile Number
        </button>
      </div>
    );
  }

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      await updateProfileName(nameInput.trim());
      setIsEditingName(false);
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrFullName.trim() || !addrPhone.trim() || !houseFlat.trim() || !street.trim() || !city.trim() || !pincode.trim()) {
      return;
    }

    await saveAddress({
      userId: user.userId,
      fullName: addrFullName.trim(),
      phone: addrPhone.trim(),
      houseFlatBuilding: houseFlat.trim(),
      address: street.trim(),
      area: area.trim() || city.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      isDefault: addresses.length === 0
    });

    setShowAddAddressModal(false);
    // Reset fields
    setHouseFlat('');
    setStreet('');
    setArea('');
    setLandmark('');
    setCity('');
    setPincode('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-amber-950/60 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
            <DiyaIcon size={16} />
            <span>Customer Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif">
            My Account
          </h1>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="py-2 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-red-400 border border-stone-800 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Card & Quick Orders (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Profile Card */}
          <div className="bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-amber-950/40">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-900 border border-amber-500/30 flex items-center justify-center text-amber-200 font-bold text-lg font-serif">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-stone-100 text-sm truncate">{user.fullName}</h3>
                <span className="text-[11px] text-amber-500 font-mono">{user.phone}</span>
              </div>
            </div>

            {/* Editable Profile Name */}
            <div>
              {isEditingName ? (
                <form onSubmit={handleUpdateName} className="space-y-2">
                  <label className="block text-[11px] text-stone-400">Edit Full Name</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="py-1 px-3 bg-amber-500 text-stone-950 rounded-lg text-xs font-bold"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="py-1 px-3 bg-stone-800 text-stone-300 rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-400 text-[11px] block">Full Name</span>
                    <span className="font-semibold text-stone-200">{user.fullName}</span>
                  </div>
                  <button
                    onClick={() => {
                      setNameInput(user.fullName);
                      setIsEditingName(true);
                    }}
                    className="text-amber-400 hover:text-amber-300 p-1 flex items-center gap-1 text-[11px]"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-amber-950/40 text-xs">
              <span className="text-stone-400 text-[11px] block">Registered Mobile</span>
              <span className="font-mono text-stone-200 font-semibold">{user.phone}</span>
              <span className="text-[10px] text-stone-500 block mt-0.5">
                (Customer credentials & address storage saved locally)
              </span>
            </div>
          </div>

          {/* Quick Orders Link */}
          <div className="bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-100 text-xs sm:text-sm">My Orders</h4>
                <p className="text-[11px] text-stone-400">{orders.length} orders recorded</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 border border-amber-950 text-xs font-semibold"
            >
              View Orders →
            </button>
          </div>
        </div>

        {/* Right Column: Saved Addresses (col-span-7) */}
        <div className="lg:col-span-7">
          <div className="bg-[#140e09] border border-amber-950/60 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-amber-950/40 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif font-bold text-stone-100 text-base">
                  Saved Customer Addresses ({addresses.length})
                </h3>
              </div>

              <button
                onClick={() => setShowAddAddressModal(true)}
                className="py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Address List */}
            {addresses.length === 0 ? (
              <div className="py-10 text-center text-xs text-stone-400">
                No delivery addresses saved yet. Click "Add Address" to save your home or office address.
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map(addr => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl bg-[#1a110a] border border-amber-950/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-stone-100 flex items-center gap-2">
                        <span>{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/20">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-stone-300">
                        {addr.houseFlatBuilding}, {addr.address}, {addr.area}
                      </p>
                      {addr.landmark && (
                        <p className="text-stone-400 text-[11px]">Landmark: {addr.landmark}</p>
                      )}
                      <p className="text-stone-300 font-mono">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-stone-400 text-[11px]">Mobile: {addr.phone}</p>
                    </div>

                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="p-2 rounded-xl text-stone-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                      title="Delete Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#150f0a] border border-amber-950/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-stone-100 text-lg mb-4">
              Add New Delivery Address
            </h3>

            <form onSubmit={handleCreateAddress} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={addrFullName}
                    onChange={e => setAddrFullName(e.target.value)}
                    className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={addrPhone}
                    onChange={e => setAddrPhone(e.target.value)}
                    className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">Flat / House / Building *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 301, Sunshine Heights"
                  value={houseFlat}
                  onChange={e => setHouseFlat(e.target.value)}
                  className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">Street / Area *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Ring Road, Koramangala"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl px-3 py-2 text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-amber-950/40">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-stone-300 hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
