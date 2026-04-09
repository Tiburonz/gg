import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import serverService from '@/services/server.service';
import { NewsArticle as NewsArticleType } from '@/types';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function NewsArticle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticleType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        const data = await serverService.getNewsById(parseInt(id));
        setArticle(data);
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-400">Article not found</p>
          <Button className="btn-primary mt-4" onClick={() => navigate('/news')}>
            Back to News
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
          onClick={() => navigate('/news')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Button>

        <Card className="card-wow max-w-4xl mx-auto">
          {article.image && (
            <div className="relative h-96 overflow-hidden rounded-t-xl">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardContent className="p-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-3 py-1 rounded text-sm font-semibold ${
                article.category === 'announcement' ? 'bg-blue-500/20 text-blue-400' :
                article.category === 'update' ? 'bg-green-500/20 text-green-400' :
                article.category === 'event' ? 'bg-purple-500/20 text-purple-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {article.category}
              </span>
              {article.featured && (
                <span className="px-3 py-1 bg-wow-ice/20 text-wow-ice rounded text-sm font-semibold">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold gradient-text mb-4">{article.title}</h1>

            <div className="flex items-center space-x-6 text-gray-400 mb-8">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">
                {article.content}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}