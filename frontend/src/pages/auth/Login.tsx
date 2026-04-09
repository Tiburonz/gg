import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import authService from '@/services/auth.service';
import { toast } from 'sonner';
import { LogIn, Shield } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { setAccount } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      setAccount(response.account);
      toast.success('Login successful!');
      navigate('/account');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast.error(message);
      if (message.includes('Email not confirmed')) {
        // redirect to confirmation page with username
        navigate(`/confirm-email?username=${encodeURIComponent(data.username)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-wow-ice to-wow-ice-light rounded-xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>

          <Card className="card-wow">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl gradient-text">Welcome Back</CardTitle>
              <CardDescription>Login to your Frostmourne account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    className="input-wow"
                    {...register('username')}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="input-wow"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-wow-ice hover:text-wow-ice-light transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="spinner w-5 h-5 mr-2" />
                      Logging in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <LogIn className="w-5 h-5 mr-2" />
                      Login
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-wow-ice hover:text-wow-ice-light font-semibold transition-colors"
                  >
                    Register here
                  </Link>
                </p>
              </div>

              {/* Demo Accounts */}
              <div className="mt-8 p-4 bg-wow-dark/50 rounded-lg border border-wow-ice/20">
                <p className="text-sm text-gray-400 mb-2 font-semibold">Demo Accounts:</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <p>Admin: username: <span className="text-wow-ice">admin</span> / password: <span className="text-wow-ice">admin123</span></p>
                  <p>User: username: <span className="text-wow-ice">testuser</span> / password: <span className="text-wow-ice">test123</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}