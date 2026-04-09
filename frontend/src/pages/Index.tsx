import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ServerStatus from '@/components/common/ServerStatus';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import serverService from '@/services/server.service';
import shopService from '@/services/shop.service';
import { NewsArticle, ShopItem } from '@/types';
import { ArrowRight, Zap, Shield, Trophy, Gift, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { t } = useTranslation();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [featuredItems, setFeaturedItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, itemsData] = await Promise.all([
          serverService.getNews(true),
          shopService.getFeaturedItems(),
        ]);
        setNews(newsData.slice(0, 3));
        setFeaturedItems(itemsData.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://mgx-backend-cdn.metadl.com/generate/images/898817/2026-01-12/03dd616e-f48a-4be3-9cb8-2e8c1aa58c68.png')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-wow-dark/70 via-wow-dark/50 to-wow-dark" />
        </div>

        {/* Frost Particles */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 rune-text">
            {t('home.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {!isAuthenticated ? (
              <>
                <Button
                  size="lg"
                  className="btn-primary text-lg px-8 py-6"
                  onClick={() => navigate('/register')}
                >
                  {t('home.startJourney')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-secondary text-lg px-8 py-6"
                  onClick={() => navigate('/login')}
                >
                  {t('nav.login')}
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                className="btn-primary text-lg px-8 py-6"
                onClick={() => navigate('/account')}
              >
                {t('home.goToAccount')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
          {t('home.whyChoose')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-wow ice-glow-hover">
            <CardHeader>
              <Zap className="w-12 h-12 text-wow-ice mb-4" />
              <CardTitle>{t('home.blizzlike')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t('home.blizzlikeDesc')}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-wow ice-glow-hover">
            <CardHeader>
              <Shield className="w-12 h-12 text-wow-ice mb-4" />
              <CardTitle>{t('home.activeGMs')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t('home.activeGMsDesc')}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-wow ice-glow-hover">
            <CardHeader>
              <Trophy className="w-12 h-12 text-wow-ice mb-4" />
              <CardTitle>{t('home.competitivePvP')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t('home.competitivePvPDesc')}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-wow ice-glow-hover">
            <CardHeader>
              <Gift className="w-12 h-12 text-wow-ice mb-4" />
              <CardTitle>{t('home.customFeatures')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t('home.customFeaturesDesc')}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Discord Integration Panel */}
      <section className="container mx-auto px-4 py-20">
        <Card className="card-wow border-l-4 border-l-wow-ice bg-gradient-to-r from-wow-dark to-wow-dark/50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-[#5865F2] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 1-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0-.084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <CardTitle className="text-3xl text-[#5865F2]">{t('home.joinDiscord')}</CardTitle>
            </div>
            <CardDescription className="text-lg text-center">
              {t('home.joinDiscordDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                className="btn-primary text-lg px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] border-[#5865F2]"
                onClick={() => window.open('https://discord.gg/URjVRJKDzp', '_blank')}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 1-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0-.084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                {t('home.joinDiscordButton')}
              </Button>
              <div className="text-sm text-gray-400">
                <p>{t('home.discordServer')}: <span className="text-[#5865F2] font-semibold">{t('home.frostmourneWoW')}</span></p>
                <p>{t('home.discordInviteCode')}: <code className="bg-gray-800 px-2 py-1 rounded text-xs">URjVRJKDzp</code></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Server Status & News */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Server Status */}
          <div className="lg:col-span-1">
            <ServerStatus />
          </div>

          {/* Latest News */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold gradient-text">{t('home.latestNews')}</h2>
              <Button variant="ghost" onClick={() => navigate('/news')}>
                {t('home.viewAll')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {news.map((article) => (
                <Card
                  key={article.id}
                  className="card-wow ice-glow-hover cursor-pointer"
                  onClick={() => navigate(`/news/${article.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                        <CardDescription>{article.excerpt}</CardDescription>
                      </div>
                      {article.image && (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-24 h-24 object-cover rounded-lg ml-4"
                        />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mt-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(article.createdAt)}</span>
                      </div>
                      <span className="px-2 py-1 bg-wow-ice/20 text-wow-ice rounded text-xs">
                        {article.category}
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Shop Items */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold gradient-text">{t('home.featuredItems')}</h2>
          <Button className="btn-primary" onClick={() => navigate('/shop')}>
            {t('home.visitShop')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
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
                </div>
                <CardTitle className={`text-xl ${item.quality ? `quality-${item.quality}` : ''}`}>
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://mgx-backend-cdn.metadl.com/generate/images/898817/2026-01-12/33614914-f3ad-4b14-894e-d1a2a06269e1.png')`,
          }}
        >
          <div className="absolute inset-0 bg-wow-dark/80" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 rune-text">
            Ready to Begin Your Adventure?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our thriving community and experience World of Warcraft as it was
            meant to be played.
          </p>
          {!isAuthenticated && (
            <Button
              size="lg"
              className="btn-primary text-lg px-8 py-6"
              onClick={() => navigate('/register')}
            >
              Create Account Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          )}
        </div>
      </section>
    </Layout>
  );
}