import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { EditModeProvider } from '@/contexts/EditModeContext';
import Index from './pages/Index';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ConfirmEmail from './pages/auth/ConfirmEmail';
import Account from './pages/account/Account';
import Shop from './pages/shop/Shop';
import ShopItem from './pages/shop/ShopItem';
import Cart from './pages/shop/Cart';
import Checkout from './pages/shop/Checkout';
import Rankings from './pages/rankings/Rankings';
import News from './pages/news/News';
import NewsArticle from './pages/news/NewsArticle';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

// Admin Route Component
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, account } = useAuthStore();
  const isAdmin = account?.role === 'admin' || account?.role === 'moderator';
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EditModeProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsArticle />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ShopItem />} />

          {/* Protected Routes */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </EditModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;