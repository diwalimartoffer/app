import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';

import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentPage } from './pages/PaymentPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { AccountPage } from './pages/AccountPage';
import { PolicyPages } from './pages/PolicyPages';
import { ContactHelpPage } from './pages/ContactHelpPage';

import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname + window.location.search;
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  const [pathOnly, searchOnly] = currentPath.split('?');
  const searchParams = new URLSearchParams(searchOnly || '');
  const isSecurePortalRoute = pathOnly.startsWith('/dm-secure-portal-9472');

  // Route parser
  const renderCurrentRoute = () => {
    // 1. Obfuscate & Block any /admin probes -> redirect to homepage
    if (pathOnly === '/admin' || pathOnly.startsWith('/admin/')) {
      return <HomePage navigate={navigate} />;
    }

    // 2. Secret Obfuscated Admin Portal Routes
    if (pathOnly === '/dm-secure-portal-9472') {
      return <AdminLoginPage navigate={navigate} />;
    }
    if (pathOnly === '/dm-secure-portal-9472/orders') {
      return <AdminDashboardPage navigate={navigate} />;
    }

    // 3. /product/:slug
    if (pathOnly.startsWith('/product/')) {
      const slug = pathOnly.replace('/product/', '');
      return <ProductDetailsPage slug={slug} navigate={navigate} />;
    }

    // 4. /category/:slug
    if (pathOnly.startsWith('/category/')) {
      const slug = pathOnly.replace('/category/', '');
      return <CategoryPage slug={slug} navigate={navigate} />;
    }

    // 5. /payment/:orderId
    if (pathOnly.startsWith('/payment/')) {
      const orderId = pathOnly.replace('/payment/', '');
      return <PaymentPage orderId={orderId} navigate={navigate} />;
    }

    // 6. /order-success/:orderId & /payment-success/:orderId
    if (pathOnly.startsWith('/order-success/')) {
      const orderId = pathOnly.replace('/order-success/', '');
      return <OrderSuccessPage orderId={orderId} navigate={navigate} />;
    }
    if (pathOnly.startsWith('/payment-success/')) {
      const orderId = pathOnly.replace('/payment-success/', '');
      return <OrderSuccessPage orderId={orderId} navigate={navigate} />;
    }

    // 7. /orders/:orderId
    if (pathOnly.startsWith('/orders/') && pathOnly !== '/orders') {
      const orderId = pathOnly.replace('/orders/', '');
      return <OrderDetailsPage orderId={orderId} navigate={navigate} />;
    }

    // 8. Specific customer routes
    switch (pathOnly) {
      case '/shop':
        return (
          <ShopPage
            navigate={navigate}
            initialFilter={searchParams.get('filter')}
            initialSearch={searchParams.get('search')}
          />
        );
      case '/cart':
        return <CartPage navigate={navigate} />;
      case '/login':
        return <LoginPage navigate={navigate} redirect={searchParams.get('redirect')} />;
      case '/checkout':
        return <CheckoutPage navigate={navigate} />;
      case '/orders':
        return <OrdersPage navigate={navigate} />;
      case '/account':
        return <AccountPage navigate={navigate} />;
      case '/privacy':
        return <PolicyPages type="privacy" navigate={navigate} />;
      case '/terms':
        return <PolicyPages type="terms" navigate={navigate} />;
      case '/returns':
        return <PolicyPages type="returns" navigate={navigate} />;
      case '/contact':
      case '/help':
      case '/faqs':
        return <ContactHelpPage navigate={navigate} />;
      case '/':
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <ToastProvider>
      <AdminAuthProvider>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <div className="min-h-screen flex flex-col bg-[#0b0805] text-[#f5efe6] font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200">
                {/* Omit Customer Header & Announcement Bar on Secret Portal */}
                {!isSecurePortalRoute && <AnnouncementBar />}
                {!isSecurePortalRoute && <Header currentPath={currentPath} navigate={navigate} />}

                {/* Main Routed View */}
                <main className="flex-1 flex flex-col">
                  {renderCurrentRoute()}
                </main>

                {/* Omit Customer Footer on Secret Portal */}
                {!isSecurePortalRoute && <Footer navigate={navigate} />}
              </div>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </AdminAuthProvider>
    </ToastProvider>
  );
}
