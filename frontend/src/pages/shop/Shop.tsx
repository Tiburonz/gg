import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import shopService from '@/services/shop.service';
import { ShopItem } from '@/types';
import { Search, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function Shop() {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await shopService.getShopItems(category === 'all' ? undefined : category);
        setItems(response.items);
      } catch (error) {
        console.error('Failed to fetch shop items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [category]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await shopService.searchItems(searchQuery);
      setItems(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: ShopItem) => {
    addItem(item);
    toast.success(`${item.name} added to cart`);
  };

  const filteredItems = searchQuery
    ? items
    : items;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">Donation Shop</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Support the server and get exclusive items, mounts, and services
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Search items..."
              className="input-wow flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button className="btn-primary" onClick={handleSearch}>
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={category} onValueChange={setCategory} className="mb-8">
          <TabsList className="bg-wow-slate border border-wow-ice/20 w-full justify-start overflow-x-auto">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="mount">Mounts</TabsTrigger>
            <TabsTrigger value="item">Items</TabsTrigger>
            <TabsTrigger value="service">Services</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Items Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredItems.length === 0 ? (
          <Card className="card-wow">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400">No items found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="card-wow ice-glow-hover cursor-pointer"
                onClick={() => navigate(`/shop/${item.id}`)}
              >
                <CardHeader>
                  <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-3 py-1 bg-wow-dark/80 rounded-full">
                      <span className="text-wow-gold font-bold">{item.price} Coins</span>
                    </div>
                    {item.featured && (
                      <div className="absolute top-2 left-2 px-3 py-1 bg-wow-ice/80 rounded-full">
                        <span className="text-white text-xs font-bold">Featured</span>
                      </div>
                    )}
                  </div>
                  <CardTitle className={`text-xl ${item.quality ? `quality-${item.quality}` : ''}`}>
                    {item.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="px-2 py-1 bg-wow-ice/20 text-wow-ice rounded text-xs">
                      {item.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{item.description}</CardDescription>
                  <Button
                    className="w-full btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}