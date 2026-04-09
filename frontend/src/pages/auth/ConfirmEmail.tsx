import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import authService from '@/services/auth.service';
import { toast } from 'sonner';

const confirmSchema = z.object({
  username: z.string().min(1),
  code: z.string().length(6, 'Code must be 6 digits'),
});

type ConfirmForm = z.infer<typeof confirmSchema>;

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const initialUsername = search.get('username') || '';

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ConfirmForm>({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      username: initialUsername,
      code: '',
    },
  });

  useEffect(() => {
    if (initialUsername) {
      setValue('username', initialUsername);
    }
  }, [initialUsername, setValue]);

  const onSubmit = async (data: ConfirmForm) => {
    setIsLoading(true);
    try {
      const account = await authService.confirmEmail(data.username, data.code);
      toast.success('Email confirmed! You are now logged in.');
      navigate('/account');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Confirmation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.resendConfirmation(initialUsername);
      toast.success('Confirmation code resent to your email (mock)');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to resend');
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="card-wow">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl gradient-text">Email Confirmation</CardTitle>
              <CardDescription>Enter the 6‑digit code sent to your Gmail</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    className="input-wow"
                    {...register('username')}
                    disabled
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Confirmation Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    className="input-wow"
                    {...register('code')}
                  />
                  {errors.code && (
                    <p className="text-red-500 text-sm">{errors.code.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Confirm Email'}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={handleResend}
                  className="text-wow-ice hover:text-wow-ice-light text-sm"
                >
                  Resend code
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Already confirmed?{' '}
                  <Link
                    to="/login"
                    className="text-wow-ice hover:text-wow-ice-light font-semibold transition-colors"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
