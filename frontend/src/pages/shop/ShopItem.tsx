import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import shopService from '@/services/shop.service';
import { ShopItem as ShopItemType } from '@/types';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ShopItem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [item, setItem] = useState<ShopItemType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      
      try {
        const data = await shopService.getItemById(parseInt(id));
        setItem(data);
      } catch (error) {
        console.error('Failed to fetch item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleAddToCart = () => {
    if (item) {
      addItem(item);
      toast.success(`${item.name} added to cart`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-400">Item not found</p>
          <Button className="btn-primary mt-4" onClick={() => navigate('/shop')}>
            Back to Shop
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/shop')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="glass rounded-xl p-8 border border-wow-ice/20">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className={`text-4xl font-bold mb-2 ${item.quality ? `quality-${item.quality}` : ''}`}>
                {item.name}
              </h1>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-wow-ice/20 text-wow-ice rounded">
                  {item.category}
                </span>
                {item.featured && (
                  <span className="px-3 py-1 bg-wow-gold/20 text-wow-gold rounded">
                    Featured
                  </span>
                )}
              </div>
            </div>

            <Card className="card-wow">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{item.description}</CardDescription>
              </CardContent>
            </Card>

            <Card className="card-wow">
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white font-semibold capitalize">{item.category}</span>
                </div>
                {item.quality && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quality</span>
                    <span className={`font-semibold capitalize quality-${item.quality}`}>
                      {item.quality}
                    </span>
                  </div>
                )}
                {item.itemId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Item ID</span>
                    <span className="text-white font-semibold">{item.itemId}</span>
                  </div>
                )}
                {item.serviceType && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Service Type</span>
                    <span className="text-white font-semibold capitalize">
                      {item.serviceType.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="glass rounded-xl p-6 border border-wow-ice/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-white">Price</span>
                <span className="text-3xl font-bold text-wow-gold">{item.price} Coins</span>
              </div>
              <Button
                className="w-full btn-primary text-lg py-6"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}