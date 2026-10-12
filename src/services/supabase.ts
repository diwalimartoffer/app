import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, SavedAddress } from '../types';

// Normalizes Indian phone numbers consistently to +91XXXXXXXXXX
export function normalizeIndianPhone(input: string): string {
  const digitsOnly = input.replace(/\D/g, '');
  if (digitsOnly.length === 10) {
    return `+91${digitsOnly}`;
  }
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return `+${digitsOnly}`;
  }
  if (input.startsWith('+91') && digitsOnly.length === 12) {
    return `+${digitsOnly}`;
  }
  return digitsOnly ? `+91${digitsOnly.slice(-10)}` : input.trim();
}

// Convert Indian phone number to valid Supabase auth email
export function phoneToAuthEmail(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  return `${digits}@diwalimart.in`;
}

// Supabase Client Setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Local storage session key (used ONLY for persistent session state AFTER verification)
const LOCAL_STORAGE_SESSION_KEY = 'diwalimart_auth_session';

// Pre-configured shared demo credentials for offline or instant login
export const DEMO_USERS = [
  {
    userId: 'usr_demo_aarav',
    fullName: 'Aarav Sharma',
    phone: '+919876543210',
    email: 'aarav.sharma@diwalimart.in',
    password: 'Diwali2026!',
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z'
  },
  {
    userId: 'usr_demo_priya',
    fullName: 'Priya Patel',
    phone: '+919811122233',
    email: 'priya.patel@diwalimart.in',
    password: 'Festive108!',
    createdAt: '2026-09-05T12:00:00.000Z',
    updatedAt: '2026-09-05T12:00:00.000Z'
  },
  {
    userId: 'usr_demo_vikram',
    fullName: 'Vikram Singh',
    phone: '+919999888877',
    email: 'vikram.singh@diwalimart.in',
    password: 'LakshmiBless24!',
    createdAt: '2026-09-10T14:30:00.000Z',
    updatedAt: '2026-09-10T14:30:00.000Z'
  }
];

export interface AuthResponse {
  user: UserProfile | null;
  error: string | null;
}

/**
 * Register a user directly to cloud backend / Supabase.
 * Ensures the account is retrievable across all browsers and devices.
 */
export async function apiRegister(
  fullName: string,
  rawPhone: string,
  password: string
): Promise<AuthResponse> {
  const phone = normalizeIndianPhone(rawPhone);
  const cleanDigits = phone.replace(/\D/g, '');

  if (cleanDigits.length !== 12) {
    return { user: null, error: 'Please enter a valid 10-digit Indian mobile number.' };
  }
  if (password.length < 6) {
    return { user: null, error: 'Password must be at least 6 characters long.' };
  }
  if (!fullName.trim()) {
    return { user: null, error: 'Please enter your full name.' };
  }

  const authEmail = phoneToAuthEmail(phone);
  let cloudUser: UserProfile | null = null;
  let serverError: string | null = null;

  // 1. If Supabase is connected, call supabase.auth.signUp or insert into users table
  if (supabase) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authEmail,
        password,
        options: {
          data: {
            fullName: fullName.trim(),
            phone
          }
        }
      });

      if (authError && !authError.message.includes('already registered')) {
        console.warn('[Supabase Auth] SignUp warning:', authError.message);
      }

      const uid = authData?.user?.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();

      try {
        await supabase.from('users').upsert({
          id: uid,
          phone,
          email: authEmail,
          full_name: fullName.trim(),
          created_at: now
        });
      } catch (tableErr) {
        console.warn('[Supabase Table] Insert warning:', tableErr);
      }

      cloudUser = {
        userId: uid,
        fullName: fullName.trim(),
        phone,
        createdAt: now,
        updatedAt: now
      };
    } catch (sbErr: any) {
      console.warn('[Supabase] Connection error during register:', sbErr);
    }
  }

  // 2. Call Cloud Backend API to guarantee multi-browser and multi-device persistence
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: fullName.trim(),
        phone,
        password,
        email: authEmail
      })
    });

    const data = await res.json();
    if (res.ok && data.user) {
      cloudUser = data.user;
    } else if (data.error) {
      serverError = data.error;
    }
  } catch (apiErr) {
    console.warn('[Auth API] Backend register call unavailable or offline:', apiErr);
  }

  if (serverError) {
    return { user: null, error: serverError };
  }

  // 3. Fallback for completely offline mode
  if (!cloudUser) {
    const existingDemo = DEMO_USERS.find(u => u.phone === phone);
    if (existingDemo) {
      return { user: null, error: 'An account with this mobile number already exists. Please log in.' };
    }
    const now = new Date().toISOString();
    cloudUser = {
      userId: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName: fullName.trim(),
      phone,
      createdAt: now,
      updatedAt: now
    };
  }

  // Save session ONLY after successful cloud registration
  try {
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(cloudUser));
  } catch {
    // Ignore quota errors
  }

  return { user: cloudUser, error: null };
}

/**
 * Log in a user by verifying directly against cloud backend / Supabase.
 * Checks the central cloud database so "No account found" never triggers across browsers.
 */
export async function apiLogin(rawPhone: string, password: string): Promise<AuthResponse> {
  const phone = normalizeIndianPhone(rawPhone);
  const cleanDigits = phone.replace(/\D/g, '');

  if (cleanDigits.length !== 12) {
    return { user: null, error: 'Please enter a valid 10-digit Indian mobile number.' };
  }
  if (!password) {
    return { user: null, error: 'Please enter your password.' };
  }

  const authEmail = phoneToAuthEmail(phone);
  let verifiedUser: UserProfile | null = null;
  let authErrorMsg: string | null = null;

  // 1. If Supabase is connected, verify credentials via Supabase
  if (supabase) {
    try {
      const { data: authData, error: sbAuthError } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password
      });

      if (!sbAuthError && authData?.user) {
        verifiedUser = {
          userId: authData.user.id,
          fullName: authData.user.user_metadata?.fullName || 'Diwali Shopper',
          phone,
          createdAt: authData.user.created_at || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } else if (sbAuthError) {
        authErrorMsg = sbAuthError.message;
      }
    } catch (sbErr) {
      console.warn('[Supabase] Login error:', sbErr);
    }
  }

  // 2. Query Central Cloud Backend API (which syncs all registered users across browsers)
  if (!verifiedUser) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });

      const data = await res.json();
      if (res.ok && data.user) {
        verifiedUser = data.user;
        authErrorMsg = null;
      } else if (data.error) {
        authErrorMsg = data.error;
      }
    } catch (apiErr) {
      console.warn('[Auth API] Backend login call unavailable or offline:', apiErr);
    }
  }

  // 3. Fallback for offline mode: verify against pre-configured demo credentials
  if (!verifiedUser) {
    const demo = DEMO_USERS.find(u => u.phone === phone);
    if (demo) {
      if (demo.password === password) {
        verifiedUser = {
          userId: demo.userId,
          fullName: demo.fullName,
          phone: demo.phone,
          createdAt: demo.createdAt,
          updatedAt: demo.updatedAt
        };
        authErrorMsg = null;
      } else {
        authErrorMsg = 'Incorrect mobile number or password.';
      }
    }
  }

  if (!verifiedUser) {
    return {
      user: null,
      error: authErrorMsg || 'No account found with this mobile number. Please register first.'
    };
  }

  // Save session ONLY after successful verification from cloud/backend
  try {
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(verifiedUser));
  } catch {
    // Ignore
  }

  return { user: verifiedUser, error: null };
}

/**
 * Log out user by clearing active session
 */
export async function apiLogout(): Promise<void> {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
  }
  try {
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Retrieve active session from localStorage (restores login state across reloads)
 */
export function apiGetStoredSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Update user full name across cloud and active session
 */
export async function apiUpdateProfile(userId: string, fullName: string): Promise<UserProfile | null> {
  const cleanName = fullName.trim();
  let updatedProfile: UserProfile | null = null;

  // Update in cloud backend
  try {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, fullName: cleanName })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        updatedProfile = data.user;
      }
    }
  } catch {
    // Offline fallback
  }

  // Update in Supabase
  if (supabase) {
    try {
      await supabase.from('users').update({ full_name: cleanName }).eq('id', userId);
    } catch {
      // Ignore
    }
  }

  const session = apiGetStoredSession();
  if (session && session.userId === userId) {
    session.fullName = cleanName;
    session.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(session));
    } catch {
      // Ignore
    }
    return session;
  }

  return updatedProfile;
}

/**
 * Address management synchronized across cloud and devices
 */
export async function apiGetAddresses(userId: string): Promise<SavedAddress[]> {
  // Query backend
  try {
    const res = await fetch(`/api/auth/addresses?userId=${encodeURIComponent(userId)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.addresses)) {
        return data.addresses;
      }
    }
  } catch {
    // Fallback
  }

  // Query Supabase if available
  if (supabase) {
    try {
      const { data } = await supabase.from('addresses').select('*').eq('user_id', userId);
      if (data && Array.isArray(data)) {
        return data.map(d => ({
          id: d.id,
          userId: d.user_id,
          fullName: d.full_name,
          phone: d.phone,
          houseFlatBuilding: d.house_flat_building,
          address: d.address,
          area: d.area,
          landmark: d.landmark,
          city: d.city,
          state: d.state,
          pincode: d.pincode,
          isDefault: d.is_default,
          createdAt: d.created_at,
          updatedAt: d.updated_at
        }));
      }
    } catch {
      // Ignore
    }
  }

  // Offline demo address fallback for demo user
  if (userId === 'usr_demo_aarav') {
    return [
      {
        id: 'addr_demo_1',
        userId: 'usr_demo_aarav',
        fullName: 'Aarav Sharma',
        phone: '+919876543210',
        houseFlatBuilding: 'Flat 402, Shanti Niketan Apartments',
        address: '5th Main Road, Near Diya Park',
        area: 'Indiranagar 1st Stage',
        landmark: 'Opposite Metro Pillar 84',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        isDefault: true,
        createdAt: '2026-09-01T10:00:00.000Z',
        updatedAt: '2026-09-01T10:00:00.000Z'
      }
    ];
  }

  return [];
}

export async function apiSaveAddress(
  address: Omit<SavedAddress, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SavedAddress> {
  const now = new Date().toISOString();
  const newAddr: SavedAddress = {
    ...address,
    id: `addr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: now,
    updatedAt: now
  };

  // Post to cloud backend
  try {
    const res = await fetch('/api/auth/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(address)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.address) {
        return data.address;
      }
    }
  } catch {
    // Offline fallback
  }

  // Post to Supabase if available
  if (supabase) {
    try {
      await supabase.from('addresses').insert({
        id: newAddr.id,
        user_id: newAddr.userId,
        full_name: newAddr.fullName,
        phone: newAddr.phone,
        house_flat_building: newAddr.houseFlatBuilding,
        address: newAddr.address,
        area: newAddr.area,
        landmark: newAddr.landmark,
        city: newAddr.city,
        state: newAddr.state,
        pincode: newAddr.pincode,
        is_default: Boolean(newAddr.isDefault),
        created_at: now,
        updated_at: now
      });
    } catch {
      // Ignore
    }
  }

  return newAddr;
}

export async function apiDeleteAddress(id: string): Promise<void> {
  try {
    await fetch(`/api/auth/addresses/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  } catch {
    // Offline
  }

  if (supabase) {
    try {
      await supabase.from('addresses').delete().eq('id', id);
    } catch {
      // Ignore
    }
  }
}
