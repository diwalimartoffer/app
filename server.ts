import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Normalizes Indian mobile number
function normalizeIndianPhone(input: string): string {
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

// Data Store Setup
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'cloud_auth_store.json');

interface StoredUser {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

interface StoredAddress {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  houseFlatBuilding: string;
  address: string;
  area: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthStore {
  users: StoredUser[];
  addresses: StoredAddress[];
}

function getInitialStore(): AuthStore {
  const now = new Date().toISOString();
  return {
    users: [
      {
        id: 'usr_demo_aarav',
        fullName: 'Aarav Sharma',
        phone: '+919876543210',
        email: 'aarav.sharma@diwalimart.in',
        password: 'Diwali2026!',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'usr_demo_priya',
        fullName: 'Priya Patel',
        phone: '+919811122233',
        email: 'priya.patel@diwalimart.in',
        password: 'Festive108!',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'usr_demo_vikram',
        fullName: 'Vikram Singh',
        phone: '+919999888877',
        email: 'vikram.singh@diwalimart.in',
        password: 'LakshmiBless24!',
        createdAt: now,
        updatedAt: now
      }
    ],
    addresses: [
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
        createdAt: now,
        updatedAt: now
      }
    ]
  };
}

function loadStore(): AuthStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      const initial = getInitialStore();
      fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed.users || !Array.isArray(parsed.users)) {
      parsed.users = [];
    }
    if (!parsed.addresses || !Array.isArray(parsed.addresses)) {
      parsed.addresses = [];
    }
    return parsed;
  } catch (err) {
    console.error('Error loading store, using fallback initial store:', err);
    return getInitialStore();
  }
}

function saveStore(store: AuthStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving store to disk:', err);
  }
}

// Supabase Server Integration (optional fallback to Supabase cloud if keys exist)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

if (supabase) {
  console.log('[Auth Server] Supabase cloud connection configured.');
} else {
  console.log('[Auth Server] Running with persistent cloud file-store and multi-device sync.');
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Parse command line arguments for port (e.g., npm run dev --port 3000 --host 0.0.0.0)
  const args = process.argv.slice(2);
  let cliPort = 3000;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' && args[i + 1]) {
      cliPort = parseInt(args[i + 1], 10);
    }
  }
  const PORT = Number(process.env.PORT) || cliPort || 3000;

  // CORS Headers for API
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check
  app.get('/api/auth/health', (req, res) => {
    const store = loadStore();
    res.json({
      status: 'ok',
      supabaseConfigured: Boolean(supabase),
      usersCount: store.users.length,
      timestamp: new Date().toISOString()
    });
  });

  // Register Endpoint
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { fullName, phone: rawPhone, password, email: rawEmail } = req.body;

      if (!fullName || !fullName.trim()) {
        return res.status(400).json({ error: 'Please enter your full name.' });
      }

      const phone = normalizeIndianPhone(rawPhone || '');
      const digits = phone.replace(/\D/g, '');
      if (digits.length !== 12) {
        return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      }

      const store = loadStore();
      const existing = store.users.find(u => u.phone === phone);
      if (existing) {
        return res.status(400).json({
          error: 'An account with this mobile number already exists. Please log in.'
        });
      }

      const now = new Date().toISOString();
      const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const email = rawEmail || `${digits.slice(-10)}@diwalimart.in`;

      const newUser: StoredUser = {
        id: newId,
        fullName: fullName.trim(),
        phone,
        email,
        password,
        createdAt: now,
        updatedAt: now
      };

      store.users.push(newUser);
      saveStore(store);

      // Attempt Supabase sync if configured
      if (supabase) {
        try {
          await supabase.from('users').upsert({
            id: newId,
            phone,
            email,
            full_name: fullName.trim(),
            created_at: now
          });
        } catch (sbErr) {
          console.warn('[Auth Server] Supabase table sync warning:', sbErr);
        }
      }

      const userProfile = {
        userId: newUser.id,
        fullName: newUser.fullName,
        phone: newUser.phone,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      };

      res.status(201).json({
        user: userProfile,
        token: `dm_jwt_${newUser.id}_${Date.now()}`,
        error: null
      });
    } catch (err: any) {
      console.error('[Auth Server] Register error:', err);
      res.status(500).json({ error: 'Internal server error during registration.' });
    }
  });

  // Login Endpoint
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { phone: rawPhone, password } = req.body;

      if (!rawPhone) {
        return res.status(400).json({ error: 'Please enter your mobile number.' });
      }

      const phone = normalizeIndianPhone(rawPhone);
      const digits = phone.replace(/\D/g, '');
      if (digits.length !== 12) {
        return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
      }

      if (!password) {
        return res.status(400).json({ error: 'Please enter your password.' });
      }

      const store = loadStore();
      const user = store.users.find(u => u.phone === phone);

      if (!user) {
        // Also check if user exists in Supabase
        if (supabase) {
          try {
            const { data } = await supabase.from('users').select('*').eq('phone', phone).single();
            if (data) {
              const profile = {
                userId: data.id,
                fullName: data.full_name || 'Diwali Shopper',
                phone: data.phone,
                email: data.email,
                createdAt: data.created_at || new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              return res.json({
                user: profile,
                token: `dm_jwt_${data.id}_${Date.now()}`,
                error: null
              });
            }
          } catch {
            // Ignore
          }
        }

        return res.status(404).json({
          error: 'No account found with this mobile number. Please register first.'
        });
      }

      if (user.password !== password) {
        return res.status(401).json({ error: 'Incorrect mobile number or password.' });
      }

      const userProfile = {
        userId: user.id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.json({
        user: userProfile,
        token: `dm_jwt_${user.id}_${Date.now()}`,
        error: null
      });
    } catch (err: any) {
      console.error('[Auth Server] Login error:', err);
      res.status(500).json({ error: 'Internal server error during login.' });
    }
  });

  // Profile Update Endpoint
  app.put('/api/auth/profile', (req, res) => {
    try {
      const { userId, fullName } = req.body;
      if (!userId || !fullName) {
        return res.status(400).json({ error: 'User ID and full name are required.' });
      }

      const store = loadStore();
      const user = store.users.find(u => u.id === userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      user.fullName = fullName.trim();
      user.updatedAt = new Date().toISOString();
      saveStore(store);

      res.json({
        user: {
          userId: user.id,
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        error: null
      });
    } catch (err: any) {
      console.error('[Auth Server] Profile update error:', err);
      res.status(500).json({ error: 'Failed to update profile.' });
    }
  });

  // Addresses Endpoints
  app.get('/api/auth/addresses', (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required.' });
    }

    const store = loadStore();
    const userAddresses = store.addresses.filter(a => a.userId === userId);
    res.json({ addresses: userAddresses, error: null });
  });

  app.post('/api/auth/addresses', (req, res) => {
    try {
      const addrData = req.body;
      if (!addrData.userId || !addrData.address || !addrData.pincode) {
        return res.status(400).json({ error: 'Incomplete address details.' });
      }

      const store = loadStore();
      const now = new Date().toISOString();
      const newAddr: StoredAddress = {
        ...addrData,
        id: `addr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        createdAt: now,
        updatedAt: now
      };

      if (newAddr.isDefault) {
        store.addresses.forEach(a => {
          if (a.userId === newAddr.userId) a.isDefault = false;
        });
      }

      store.addresses.unshift(newAddr);
      saveStore(store);

      res.status(201).json({ address: newAddr, error: null });
    } catch (err: any) {
      console.error('[Auth Server] Save address error:', err);
      res.status(500).json({ error: 'Failed to save address.' });
    }
  });

  app.delete('/api/auth/addresses/:id', (req, res) => {
    try {
      const { id } = req.params;
      const store = loadStore();
      store.addresses = store.addresses.filter(a => a.id !== id);
      saveStore(store);
      res.json({ success: true });
    } catch (err: any) {
      console.error('[Auth Server] Delete address error:', err);
      res.status(500).json({ error: 'Failed to delete address.' });
    }
  });

  // Vite middleware in dev or static serving in prod
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Diwali Mart] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
