import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Cart() {
  const navigate = useNavigate();
  const { account } = useAuthStore();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const total = getTotal();
    if (account && account.balance < total) {
      toast.error('Insufficient balance. Please add more coins.');
      return;
    }

    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Card className="card-wow max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
              <p className="text-gray-400 mb-6">Add some items from our shop to get started</p>
              <Button className="btn-primary" onClick={() => navigate('/shop')}>
                Browse Shop
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold gradient-text mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((cartItem) => (
              <Card key={cartItem.item.id} className="card-wow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold ${cartItem.item.quality ? `quality-${cartItem.item.quality}` : ''}`}>
                        {cartItem.item.name}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">{cartItem.item.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="px-2 py-1 bg-wow-ice/20 text-wow-ice rounded text-xs">
                          {cartItem.item.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right space-y-4">
                      <p className="text-2xl font-bold text-wow-gold">
                        {cartItem.item.price * cartItem.quantity} Coins
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-white font-semibold w-8 text-center">
                          {cartItem.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            removeItem(cartItem.item.id);
                            toast.success('Item removed from cart');
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                clearCart();
                toast.success('Cart cleared');
              }}
            >
              Clear Cart
            </Button>
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

                {account && (
                  <div className="bg-wow-dark/50 rounded-lg p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Your Balance</span>
                      <span className="text-wow-gold font-semibold">
                        {account.balance} Coins
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-400">After Purchase</span>
                      <span className={`font-semibold ${
                        account.balance - getTotal() >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {account.balance - getTotal()} Coins
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full btn-primary text-lg py-6"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate('/shop')}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}