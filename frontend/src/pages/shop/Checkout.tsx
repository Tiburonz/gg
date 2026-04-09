import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import donationService from '@/services/donation.service';
import characterService from '@/services/character.service';
import { Character } from '@/types';
import { CreditCard, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function Checkout() {
  const navigate = useNavigate();
  const { account } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('balance');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCharacters = async () => {
      if (!account) return;
      const chars = await characterService.getCharactersByAccount(account.id);
      setCharacters(chars);
    };
    fetchCharacters();
  }, [account]);

  const handlePurchase = async () => {
    if (!account) {
      toast.error('Please login to continue');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const total = getTotal();
    if (paymentMethod === 'balance' && account.balance < total) {
      toast.error('Insufficient balance');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await donationService.processPurchase({
        items,
        paymentMethod: paymentMethod as 'paypal' | 'stripe' | 'crypto',
        totalAmount: total,
      });

      if (result.success) {
        setSuccess(true);
        clearCart();
        toast.success(result.message);
        
        setTimeout(() => {
          navigate('/account');
        }, 3000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Card className="card-wow max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold gradient-text mb-2">Purchase Successful!</h2>
              <p className="text-gray-400 mb-6">
                Your items will be delivered to your character shortly.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to your account...
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold gradient-text mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Character Selection */}
            <Card className="card-wow">
              <CardHeader>
                <CardTitle>Select Character</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedCharacter} onValueChange={setSelectedCharacter}>
                  <SelectTrigger className="input-wow">
                    <SelectValue placeholder="Choose a character to receive items" />
                  </SelectTrigger>
                  <SelectContent>
                    {characters.map((char) => (
                      <SelectItem key={char.guid} value={char.guid.toString()}>
                        {char.name} - Level {char.level} {characterService.getClassName(char.class)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="card-wow">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'balance'
                      ? 'border-wow-ice bg-wow-ice/10'
                      : 'border-wow-ice/20 hover:border-wow-ice/40'
                  }`}
                  onClick={() => setPaymentMethod('balance')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Account Balance</p>
                      <p className="text-sm text-gray-400">
                        Current balance: {account?.balance || 0} Coins
                      </p>
                    </div>
                    <CreditCard className="w-6 h-6 text-wow-ice" />
                  </div>
                </div>

                <div className="p-4 rounded-lg border-2 border-wow-ice/20 bg-wow-dark/50">
                  <p className="text-sm text-gray-400 text-center">
                    Other payment methods coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="card-wow sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((cartItem) => (
                    <div key={cartItem.item.id} className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {cartItem.item.name} x{cartItem.quantity}
                      </span>
                      <span className="text-white">
                        {cartItem.item.price * cartItem.quantity} Coins
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-wow-ice/20 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-wow-gold">{getTotal()} Coins</span>
                  </div>
                </div>

                <Button
                  className="w-full btn-primary text-lg py-6"
                  onClick={handlePurchase}
                  disabled={isProcessing || !selectedCharacter}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <div className="spinner w-5 h-5 mr-2" />
                      Processing...
                    </span>
                  ) : (
                    'Complete Purchase'
                  )}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate('/cart')}
                  disabled={isProcessing}
                >
                  Back to Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}