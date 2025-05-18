
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { fetchNewsBySlug } from '../../utils/api';

export default function NewsArticle() {
  const router = useRouter();
  const { slug } = router.query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchNewsBySlug(slug)
        .then(data => {
          setArticle(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching article:', error);
          setLoading(false);
        });
    }
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-500">Article not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        {article.subtitle && (
          <p className="text-xl text-gray-600 mb-4">{article.subtitle}</p>
        )}
        <div className="text-gray-500 mb-8">
          {new Date(article.publish_date).toLocaleDateString()}
          {article.source && ` | Source: ${article.source}`}
        </div>
        
        {article.image && (
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full rounded-lg mb-8 object-cover"
          />
        )}
        
        <div className="prose max-w-none" 
             dangerouslySetInnerHTML={{ __html: article.body }} 
        />
      </article>
    </Layout>
  );
}
